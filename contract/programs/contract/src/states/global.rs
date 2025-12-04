use anchor_lang::prelude::*;

/// Platform-global settings.
#[account]
#[derive(InitSpace, Debug)]
pub struct Global {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub operator: Pubkey,

    pub fee_authority: Pubkey,

    pub creator_fee_amount: u64,
    pub min_liquidity_threshold: u64,

    pub decimal: u8,

    pub betting_fee_percentage: f64, // bps
    pub fund_fee_percentage: u64,    // bps

    pub market_count: u64,
    pub bump: u8,
    pub version: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GlobalParams {
    pub fee_authority: Pubkey,
    pub creator_fee_amount: u64,
    pub market_count: u64,
    pub decimal: u8,
    pub fund_fee_percentage: u64,
    pub betting_fee_percentage: f64,
}
