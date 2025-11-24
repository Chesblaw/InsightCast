use anchor_lang::prelude::*;

/// Global configuration.
/// This account stores platform-wide settings such as authorities, 
/// fee configuration, and system parameters. Initialized once per deployment.

#[account]
#[derive(InitSpace, Debug)]
pub struct Global {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub operator: Pubkey,
    pub creator_fee_lamports: u64,
    pub min_liquidity_threshold: u64,
    pub decimals: u8,
    pub betting_fee_bps: u16,
    pub fund_fee_bps: u16,
    pub market_count: u64,
    pub bump: u8,
    pub version: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GlobalParams {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub operator: Pubkey,
    pub creator_fee_lamports: u64,
    pub min_liquidity_threshold: u64,
    pub decimals: u8,
    pub betting_fee_bps: u16,
    pub fund_fee_bps: u16,
    pub version: u8,
}
