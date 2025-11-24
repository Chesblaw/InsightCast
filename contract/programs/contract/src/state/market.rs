use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct Market {
    pub creator: Pubkey,             
    pub global: Pubkey,           
    pub name: String,                
    pub description: String,       
    pub token_yes_amount: u64,    
    pub token_no_amount: u64,    
    pub total_liquidity: u64,        
    pub status: MarketStatus,   
    pub result: Option<bool>,     
    pub created_at: i64,          
    pub resolved_at: Option<i64>,    
    pub bump: u8,                  
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum MarketStatus {
    Pending,    
    Active,    
    Settled,    
    Cancelled, 
}

#[account]
#[derive(Debug)]
pub struct TokenPosition {
    pub user: Pubkey,               
    pub market: Pubkey,
    pub yes_amount: u64,             
    pub no_amount: u64,          
    pub total_bet: u64,              
    pub claimed: bool,           
    pub bump: u8,                
}
