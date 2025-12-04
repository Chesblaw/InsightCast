use crate::constants::{GLOBAL_SEED, MARKET_SEED, MINT_SEED_A, MINT_SEED_B};
use crate::errors::ContractError;
use crate::events::MarketCreated;
use crate::states::{global::*, market::*};
use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
    },
    token::{Mint, Token},
};
use anchor_lang::solana_program::{
    system_instruction,
    program::invoke_signed,
};

#[derive(Accounts)]
#[instruction(params: MarketParams)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: fee authority is validated by constraint
    #[account(
        mut,
        constraint = fee_authority.key() == global_pda.fee_authority @ ContractError::InvalidFeeAuthority
    )]
    pub fee_authority: AccountInfo<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + Market::INIT_SPACE,
        seeds = [MARKET_SEED.as_bytes(), &params.market_id.as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        seeds = [GLOBAL_SEED.as_bytes()],
        bump
    )]
    pub global_pda: Account<'info, Global>,

    /// CHECK: via switchboard SDK
    pub feed: AccountInfo<'info>,

    /// CHECK: metadata accounts
    #[account(mut)]
    pub metadata_a: UncheckedAccount<'info>,

    /// CHECK: metadata accounts
    #[account(mut)]
    pub metadata_b: UncheckedAccount<'info>,

    #[account(
        init,
        seeds = [MINT_SEED_A.as_bytes(), market.key().as_ref()],
        bump,
        payer = user,
        mint::decimals = global_pda.decimal,
        mint::authority = market,
    )]
    pub token_mint_a: Account<'info, Mint>,

    #[account(
        init,
        seeds = [MINT_SEED_B.as_bytes(), market.key().as_ref()],
        bump,
        payer = user,
        mint::decimals = global_pda.decimal,
        mint::authority = market,
    )]
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

impl<'info> CreateMarket<'info> {
    pub fn create_market(ctx: &mut Context<CreateMarket>, params: MarketParams) -> Result<()> {
        // update market settings
        ctx.accounts.market.update_market_settings(
            params.value,
            params.range,
            ctx.accounts.user.key(),
            ctx.accounts.feed.key(),
            ctx.accounts.token_mint_a.key(),
            ctx.accounts.token_mint_b.key(),
            params.token_amount,
            params.token_price,
            params.date,
        )?;

        ctx.accounts.market.bump = ctx.bumps.market;

        msg!("🎫 Metadata creation for token A 🎫");
        // using a simple metadata seed for demonstration (adjust if you used others)
        let seeds: &[&[u8]] = &[b"meta"];
        ctx.accounts.initialize_meta(
            Some(params.name_a),
            true,
            Some(params.symbol_a),
            Some(params.url_a),
            seeds,
        )?;

        msg!("🎫 Metadata creation for token B 🎫");
        ctx.accounts.initialize_meta(
            Some(params.name_b),
            false,
            Some(params.symbol_b),
            Some(params.url_b),
            seeds,
        )?;

        // Transfer creator fee to fee authority
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.fee_authority.key(),
            ctx.accounts.global_pda.creator_fee_amount,
        );

        invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.fee_authority.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[], // no program signer seeds needed for transferring from user
        )?;

        emit!(MarketCreated {
            market_id: ctx.accounts.market.key(),
            value: ctx.accounts.market.value,
            range: ctx.accounts.market.range,
            creator: ctx.accounts.user.key(),
            feed: ctx.accounts.feed.key(),
            token_a: ctx.accounts.token_mint_a.key(),
            token_b: ctx.accounts.token_mint_b.key(),
            market_status: ctx.accounts.market.market_status.clone(),
            token_a_amount: ctx.accounts.market.token_a_amount,
            token_b_amount: ctx.accounts.market.token_b_amount,
            token_price_a: ctx.accounts.market.token_price_a,
            token_price_b: ctx.accounts.market.token_price_b,
            total_reserve: ctx.accounts.market.total_reserve,
        });

        Ok(())
    }

    /// Initialize token metadata via CPI to token metadata program.
    /// `mint_auth_signer_seeds` must be the PDA seeds for the market (shape `&[&[u8]]`).
    pub fn initialize_meta(
        &self,
        name: Option<String>,
        is_token_a: bool,
        symbol: Option<String>,
        uri: Option<String>,
        mint_auth_signer_seeds: &[&[u8]], // expected shape
    ) -> Result<()> {
        let mint_info = if is_token_a {
            self.token_mint_a.to_account_info()
        } else {
            self.token_mint_b.to_account_info()
        };

        let metadata_info = if is_token_a {
            self.metadata_a.to_account_info()
        } else {
            self.metadata_b.to_account_info()
        };

        let mint_authority_info = self.market.to_account_info();

        let token_data = DataV2 {
            name: name.unwrap_or_default(),
            symbol: symbol.unwrap_or_default(),
            uri: uri.unwrap_or_default(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        // ---- FIXED SHAPE FOR CPI ----------
        // convert &[&[u8]] → &[ &[ &[u8] ] ]
        let signer_seeds: &[&[&[u8]]] = &[mint_auth_signer_seeds];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: self.user.to_account_info(),
                mint: mint_info,
                metadata: metadata_info,
                update_authority: mint_authority_info.clone(),
                mint_authority: mint_authority_info,
                system_program: self.system_program.to_account_info(),
                rent: self.rent.to_account_info(),
            },
            signer_seeds,
        );

        create_metadata_accounts_v3(cpi_ctx, token_data, false, true, None)?;
        Ok(())
    }
}
