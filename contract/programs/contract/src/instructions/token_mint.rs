use crate::constants::{GLOBAL_SEED, MARKET_SEED};
use crate::errors::ContractError;
use crate::states::global::Global;
use crate::states::market::{Market, MarketStatus};
use anchor_lang::prelude::*;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(market_id: String)]
pub struct TokenMint<'info> {
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint_a,
        associated_token::authority = market
    )]
    pub pda_token_a_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint_b,
        associated_token::authority = market
    )]
    pub pda_token_b_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: global fee authority is validated via constraint
    #[account(
        mut,
        constraint = fee_authority.key() == global.fee_authority @ ContractError::InvalidFeeAuthority
    )]
    pub fee_authority: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [MARKET_SEED.as_bytes(), market_id.as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        seeds = [GLOBAL_SEED.as_bytes()],
        bump
    )]
    pub global: Account<'info, Global>,

    #[account(mut)]
    /// CHECK: Using seed to validate metadata account
    pub metadata_a: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK: Using seed to validate metadata account
    pub metadata_b: UncheckedAccount<'info>,

    #[account(mut)]
    /// "Yes" token mint
    pub token_mint_a: Account<'info, Mint>,

    #[account(mut)]
    /// "No" token mint
    pub token_mint_b: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,

    /// CHECK: associated token program account
    pub associated_token_program: UncheckedAccount<'info>,

    /// CHECK: token metadata program account
    pub token_metadata_program: UncheckedAccount<'info>,

    /// CHECK: rent account
    pub rent: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> TokenMint<'info> {
    /// Mint initial tokens or mint as-needed. This version uses market state and global decimal
    /// to compute proper amounts and uses the market PDA as the mint authority signer.
    pub fn token_mint(ctx: Context<TokenMint>, _market_id: String) -> Result<()> {
        // Get an immutable AccountInfo for the market *before* taking a mutable borrow.
        // This avoids E0502 borrow-checker conflicts.
        let market_info = ctx.accounts.market.to_account_info().clone();

        // Now take a mutable borrow to the market account data
        let market = &mut ctx.accounts.market;

        let decimal_multiplier = 10u64.pow(ctx.accounts.global.decimal as u32);

        // Build signer seeds for the market PDA
        let binding = market.key();
        let market_seeds: &[&[u8]] = &[
            crate::constants::MARKET_SEED.as_bytes(),
            binding.as_ref(),
            &[market.bump],
        ];

        // Determine token amounts to mint (example uses market.token_b_amount)
        let token_b_amount = market
            .token_b_amount
            .checked_mul(decimal_multiplier)
            .ok_or(ContractError::ArithmeticError)?;

        // Use the token program's mint_to CPI with signer.
        // Use `market_info` for the authority field (we captured it earlier).
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    authority: market_info.clone(), // use the pre-cloned AccountInfo
                    to: ctx.accounts.pda_token_b_account.to_account_info(),
                    mint: ctx.accounts.token_mint_b.to_account_info(),
                },
                &[market_seeds],
            ),
            token_b_amount,
        )?;

        // Update market status (ensure update_market_status returns Result<()>).
        market.update_market_status(MarketStatus::Prepare)?;

        Ok(())
    }
}
