pub mod constants;
pub mod instructions;
pub mod states;
pub mod errors;
pub mod events;
pub mod utils;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::{
    betting::*, create_market::*, deposit_liquidity::*, token_mint::*,
};
pub use errors::*;
pub use events::*;
pub use utils::*;

pub use states::{
    global::GlobalParams,
    market::{MarketStatus, MarketParams, BettingParams, TokenPosition},
};

declare_id!("J6FdkHbBfUhPwTsnNrqsQRTSATwD6T8TChj6q3f68v63");

#[program]
pub mod contract {
    use super::*;

    pub fn init_market(mut ctx: Context<CreateMarket>, params: MarketParams) -> Result<()> {
        CreateMarket::create_market(&mut ctx, params)
    }

    pub fn add_liquidity(ctx: Context<DepositLiquidity>, amount: u64) -> Result<()> {
        deposit_liquidity(ctx, amount)
    }

    pub fn create_bet(ctx: Context<Betting>, params: BettingParams) -> Result<()> {
        Betting::betting(ctx, params)
    }

    pub fn mint_token(ctx: Context<TokenMint>, market_id: String) -> Result<()> {
        TokenMint::token_mint(ctx, market_id)
    }

}