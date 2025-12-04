use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct Market {
    pub creator: Pubkey,
    pub global: Pubkey,

    pub value: f64,
    pub range: u8,

    pub name: String,
    pub description: String,

    pub token_a_amount: u64,
    pub token_b_amount: u64,

    pub token_price_a: u64,
    pub token_price_b: u64,

    pub total_reserve: u64,

    pub market_status: MarketStatus,

    pub result: Option<bool>,

    pub created_at: i64,
    pub resolved_at: Option<i64>,

    pub feed: Pubkey,
    pub token_a: Pubkey,
    pub token_b: Pubkey,

    pub bump: u8,

    pub status: MarketStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MarketParams {
    pub market_id: String,
    pub name_a: String,
    pub symbol_a: String,
    pub url_a: String,
    pub name_b: String,
    pub symbol_b: String,
    pub url_b: String,
    pub name: String,
    pub description: String,
    pub value: f64,
    pub date: i64,
    pub range: u8,
    pub token_amount: u64,
    pub token_price: u64,
    pub feed: Pubkey,
    pub creator: Pubkey,
    pub token_a: Pubkey,
    pub token_b: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BettingParams {
    pub market_id: String,
    pub amount: u64,
    pub is_yes: bool,
    pub user: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum MarketStatus {
    Prepare,
    Active,
    Locked,
    Resolved,
    Closed,
}


impl Market {
    pub fn update_market_settings(
        &mut self,
        value: f64,
        range: u8,
        creator: Pubkey,
        feed: Pubkey,
        token_a: Pubkey,
        token_b: Pubkey,
        token_amount: u64,
        token_price: u64,
        date: i64,
    ) -> Result<()> {
        self.creator = creator;
        self.value = value;
        self.range = range;
        self.feed = feed;
        self.token_a = token_a;
        self.token_b = token_b;

        self.token_a_amount = token_amount;
        self.token_b_amount = token_amount;

        self.token_price_a = token_price;
        self.token_price_b = token_price;

        self.total_reserve = 0;

        self.created_at = date;
        self.market_status = MarketStatus::Prepare;

        Ok(())
    }

pub fn update_market_status(&mut self, status: MarketStatus) -> Result<()> {
    self.status = status;
    Ok(())
}


    pub fn set_token_price(&mut self, amount: u64, is_yes: bool) -> Result<()> {
        if is_yes {
            self.token_price_a += amount / 100;
        } else {
            self.token_price_b += amount / 100;
        }
        Ok(())
    }

    pub fn get_signer<'a>(
        bump: &'a u8,
        id: &'a [u8],
    ) -> [&'a [u8]; 3] {
        [
            b"market",
            id,
            std::slice::from_ref(bump),
        ]
    }
}

impl anchor_lang::Space for Market {
    const INIT_SPACE: usize = 8 // discriminator
        + 8 // value
        + 32 // name (estimate max length, adjust)
        + 32 // description
        + 1 // market_status enum (u8)
        + 8; // token_amount
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
