use crate::constants::GLOBAL_SEED;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, Token};
use crate::errors::ContractError;
use crate::states::{global::*, market::*};
use crate::utils::token_transfer;
use crate::events::BettingEvent;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke_signed;

#[derive(Accounts)]
#[instruction(params: BettingParams)]
pub struct Betting<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: creator is validated via constraint
    #[account(
        mut,
        constraint = market.creator == creator.key() @ ContractError::InvalidCreator
    )]
    pub creator: AccountInfo<'info>,

    /// Reward token mint (not used directly for CPI; kept for validation)
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = market
    )]
    pub pda_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    /// CHECK: global fee authority validated via constraint
    #[account(
        mut,
        constraint = fee_authority.key() == global.fee_authority @ ContractError::InvalidFeeAuthority
    )]
    pub fee_authority: AccountInfo<'info>,

    #[account(
        mut,
        constraint = market.market_status == MarketStatus::Active @ ContractError::MarketNotActive
    )]
    pub market: Account<'info, Market>,

    #[account(
        seeds = [GLOBAL_SEED.as_bytes()],
        bump
    )]
    pub global: Account<'info, Global>,

    pub token_program: Program<'info, Token>,

    /// CHECK: associated token program account
    pub associated_token_program: UncheckedAccount<'info>,

    /// CHECK: token metadata program account
    pub token_metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Betting<'info> {
    pub fn betting(ctx: Context<Betting>, params: BettingParams) -> Result<()> {
        // Use market from ctx directly
        let market = &mut ctx.accounts.market;
        let decimal_multiplier = 10u64.pow(ctx.accounts.global.decimal as u32);

        // Calculate SOL to buy
        let token_price = if params.is_yes {
            market.token_price_a
        } else {
            market.token_price_b
        };
        let sol_to_buy = params
            .amount
            .checked_mul(decimal_multiplier)
            .ok_or(ContractError::ArithmeticError)?
            // assume lamports scaling: dividing by 10^9 to convert token units to SOL lamports
            .checked_div(10u64.pow(9))
            .ok_or(ContractError::ArithmeticError)?
            .checked_mul(token_price)
            .ok_or(ContractError::ArithmeticError)?;

        msg!("🎫 sol_to_buy 🎫 {}", sol_to_buy);

        let _market_info = market.to_account_info().clone();

        // Transfer SOL from user to market account
        let transfer_market_instruction = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &market.to_account_info().key(),
            sol_to_buy,
        );

        invoke_signed(
            &transfer_market_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                market.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[], // no program signer needed for transferring from user
        )?;

        // Build signer seeds for market PDA
        // seeds must match how market PDA was created: [MARKET_SEED, market_id_bytes, bump]
        let binding = market.key();
        let market_seeds: &[&[u8]] = &[
            crate::constants::MARKET_SEED.as_bytes(),
            binding.as_ref(),
            &[market.bump],
        ];
        // token_transfer expects &[&[u8]] for signer seeds
        let mint_auth_signer_seeds: &[&[u8]] = market_seeds;

        // Compute token amount to mint/transfer to user (scaled by decimals)
        let token_amount = params
            .amount
            .checked_mul(decimal_multiplier)
            .ok_or(ContractError::ArithmeticError)?;
        msg!("🎫 token_amount to user 🎫 {}", token_amount);

        // Transfer tokens from PDA token account to user ATA using the market as authority
        token_transfer(
            ctx.accounts.pda_token_account.to_account_info(),
            ctx.accounts.user_token_account.to_account_info(),
            market.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            mint_auth_signer_seeds,
            token_amount,
        )?;

        // Transfer fee to fee authority (in SOL)
        let fee_amount_to_auth = sol_to_buy
            .checked_mul(ctx.accounts.global.betting_fee_percentage as u64)
            .ok_or(ContractError::ArithmeticError)?
            .checked_div(100)
            .ok_or(ContractError::ArithmeticError)?;
        msg!("🎫 fee_amount_to_auth 🎫 {}", fee_amount_to_auth);

        let transfer_auth_instruction = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.fee_authority.key(),
            fee_amount_to_auth,
        );

        invoke_signed(
            &transfer_auth_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.fee_authority.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        // Update market token amounts
        if params.is_yes {
            market.token_a_amount = market.token_a_amount.checked_add(params.amount)
                .ok_or(ContractError::ArithmeticError)?;
        } else {
            market.token_b_amount = market.token_b_amount.checked_add(params.amount)
                .ok_or(ContractError::ArithmeticError)?;
        }

        market.set_token_price(params.amount, params.is_yes)?;

        emit!(BettingEvent {
            token_a_price: market.token_price_a,
            token_b_price: market.token_price_b,
        });

        Ok(())
    }
}
