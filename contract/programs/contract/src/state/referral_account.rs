use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct ReferralAccount {
    pub referrer: Pubkey,       
    pub referee: Pubkey,        
    pub market: Pubkey,       
    pub reward_claimed: bool,   
    pub reward_amount: u64,     
    pub created_at: i64,       
    pub bump: u8,              
}
