use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token;
use anchor_spl::token::Transfer;

pub fn sol_transfer<'a>(
    from_account: AccountInfo<'a>,
    to_account: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    let transfer_instruction =
        solana_program::system_instruction::transfer(from_account.key, to_account.key, amount);

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[from_account, to_account, system_program],
        &[],
    )?;

    Ok(())
}

/// Transfers SPL tokens using a program signer (PDA).
///
/// - `from_ata`, `to_ata`, `authority`, `token_program` are AccountInfo for CPI.
/// - `signer_seeds` is expected to be `&[&[u8]]` (the normal seeds for the PDA). This
///    function will wrap it to `&[&[&[u8]]]` as required by `CpiContext::new_with_signer`.
pub fn token_transfer<'a>(
    from_ata: AccountInfo<'a>,
    to_ata: AccountInfo<'a>,
    authority: AccountInfo<'a>,
    token_program: AccountInfo<'a>,
    signer_seeds: &[&[u8]],
    amount: u64,
) -> Result<()> {
    // wrap &[&[u8]] -> &[&[&[u8]]]
    let signer: &[&[&[u8]]] = &[signer_seeds];

    let cpi_ctx = CpiContext::new_with_signer(
        token_program,
        Transfer {
            from: from_ata,
            to: to_ata,
            authority,
        },
        signer,
    );

    token::transfer(cpi_ctx, amount)?;

    Ok(())
}
