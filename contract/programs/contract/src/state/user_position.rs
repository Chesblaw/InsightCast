use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct UserPosition {
    pub user: Pubkey,           
    pub market: Pubkey,         
    pub yes_tokens: u64,        
    pub no_tokens: u64,      
    pub total_bet: u64,      
    pub claimed: bool,           
    pub created_at: i64,      
    pub bump: u8,                
}
