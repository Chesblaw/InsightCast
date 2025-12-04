import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { PublicKey, SystemProgram, Keypair, Transaction, Connection, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { GLOBAL_SEED, programId, SOL_USDC_FEED, MARKET_SEED, TOKEN_METADATA_PROGRAM_ID, tokenAAmount, tokenBAmount, feeAuthority, METADATA_SEED, MINT_SEED_A, MINT_SEED_B } from "./const";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getMint } from "@solana/spl-token";
import { getOrCreateATAInstruction, getAssociatedTokenAccount } from "./utils";
import BN from "bn.js";

let owner: Keypair;
let tokenA: PublicKey;
let tokenB: PublicKey;
let provider: anchor.AnchorProvider;
let market: PublicKey;
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

describe("prediction", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  owner = anchor.Wallet.local().payer;
  provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.Contract as Program<Contract>;

  before(async () => {
    market = PublicKey.findProgramAddressSync(
      [Buffer.from(MARKET_SEED), owner.publicKey.toBuffer()],
      program.programId
    )[0];

    tokenA = PublicKey.findProgramAddressSync(
      [Buffer.from(MINT_SEED_A), market.toBuffer()],
      program.programId
    )[0];

    tokenB = PublicKey.findProgramAddressSync(
      [Buffer.from(MINT_SEED_B), market.toBuffer()],
      program.programId
    )[0];

    console.log("market ====>", market.toBase58());
    console.log("tokenA ====>", tokenA.toBase58());
    console.log("tokenB ====>", tokenB.toBase58());

    program.addEventListener("oracleResUpdated", (event, slot, signature) => {
      console.log("👻 OracleResUpdated 👻", event.oracleRes);
    });

    program.addEventListener("globalInitialized", (event, slot, signature) => {
      console.log("👻 GlobalInitialized 👻", event);
    });

    program.addEventListener("marketCreated", (event, slot, signature) => {
      console.log("👻 MarketCreated 👻", event);
    });
  });

  it("Create market", async () => {
    const global = PublicKey.findProgramAddressSync([Buffer.from(MARKET_SEED)], program.programId)[0];

    const pdaTokenAAccount = await getAssociatedTokenAccount(market, tokenA);
    const pdaTokenBAccount = await getAssociatedTokenAccount(market, tokenB);

    const metadataA = PublicKey.findProgramAddressSync(
      [Buffer.from(METADATA_SEED), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenA.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    const metadataB = PublicKey.findProgramAddressSync(
      [Buffer.from(METADATA_SEED), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenB.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    const txMarket = await program.methods.initMarket({
      marketId: "market1",
      nameA: "tokenA",
      symbolA: "tokenA",
      urlA: "https://tokenA.com",
      nameB: "tokenB",
      symbolB: "tokenB",
      urlB: "https://tokenB.com",
      name: "Prediction Market",
      description: "Test market",
      value: 0.5,
      date: new BN(Math.floor(Date.now() / 1000)),
      range: 2,
      tokenAmount: new BN(tokenAAmount),
      tokenPrice: new BN(0.00005 * 1e9),
      feed: new PublicKey(SOL_USDC_FEED),
      creator: owner.publicKey,
      tokenA,
      tokenB,
    }).accounts({
      user: owner.publicKey,
      feeAuthority,
      market,
      globalPda: global,
      feed: new PublicKey(SOL_USDC_FEED),
      metadataA,
      metadataB,
      tokenMintA: tokenA,
      tokenMintB: tokenB,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    }).transaction();

    const txMint = await program.methods.mintToken("market1").accounts({
      pdaTokenAAccount,
      pdaTokenBAccount,
      user: owner.publicKey,
      feeAuthority,
      market,
      global,
      metadataA,
      metadataB,
      tokenMintA: tokenA,
      tokenMintB: tokenB,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    }).transaction();

    const tx = new Transaction().add(txMarket, txMint);
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = owner.publicKey;

    const sig = await connection.sendTransaction(tx, [owner], { skipPreflight: true });
    await connection.confirmTransaction(sig, "confirmed");
    console.log("🤖 Market tx signature:", sig);
  });

  it("Deposit liquidity", async () => {
    const global = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], program.programId)[0];
    const market = PublicKey.findProgramAddressSync([Buffer.from(MARKET_SEED), owner.publicKey.toBuffer()], program.programId)[0];

    const tx = await program.methods.addLiquidity(new BN(0.1 * 1e9))
      .accounts({
        user: owner.publicKey,
        feeAuthority,
        market,
        global,
        systemProgram: SystemProgram.programId,
      }).transaction();

    const txFinal = new Transaction();
    txFinal.add(tx);
    txFinal.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txFinal.feePayer = owner.publicKey;

    const sig = await connection.sendTransaction(txFinal, [owner], { skipPreflight: true });
    await connection.confirmTransaction(sig, "confirmed");
    console.log("🤖 Add liquidity tx signature:", sig);
  });

  it("Place a bet", async () => {
    const global = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], program.programId)[0];
    const market = PublicKey.findProgramAddressSync([Buffer.from(MARKET_SEED), owner.publicKey.toBuffer()], program.programId)[0];
    const pdaTokenAAccount = await getAssociatedTokenAccount(market, tokenA);

    const [userTokenAAccount, createATA] = await getOrCreateATAInstruction(tokenA, owner.publicKey, connection);

    const tx = await program.methods.createBet({
      marketId: "market1",
      amount: new BN(10000),
      isYes: true,
      user: owner.publicKey
    }).accounts({
      user: owner.publicKey,
      creator: owner.publicKey,
      tokenMint: tokenA,
      pdaTokenAccount: pdaTokenAAccount,
      userTokenAccount: userTokenAAccount,
      feeAuthority,
      market,
      global,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    }).transaction();

    const txFinal = new Transaction();
    if (createATA) txFinal.add(createATA);
    txFinal.add(tx);
    txFinal.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txFinal.feePayer = owner.publicKey;

    const sig = await connection.sendTransaction(txFinal, [owner], { skipPreflight: true });
    await connection.confirmTransaction(sig, "confirmed");
    console.log("🤖 Bet tx signature:", sig);
  });
});
