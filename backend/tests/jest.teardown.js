module.exports = async () => {
  try {
    if (global.__PG_POOL) {
      await global.__PG_POOL.end();
      console.log("Jest global teardown: PostgreSQL pool closed");
    }
  } catch (err) {
    console.error("Jest global teardown error:", err);
    throw err;
  }
};
