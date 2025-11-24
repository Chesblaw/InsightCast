pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::*;

pub use state::{
    global::GlobalParams, 
    market::{MarketStatus, TokenPosition}, 
    user_position::UserPosition, 
    referral_account::ReferralAccount
};

declare_id!("J1jirhqdRSe4CdwmUHRAzh7QyWxUoaNrWt3UZoLtMiYi");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
