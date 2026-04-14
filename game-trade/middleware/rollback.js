function rollback(conn, err, callback) {
  conn.rollback(function () {
    conn.release();
    callback(err);
  });
}

module.exports = {rollback}