module.exports =
  development:
    driver: "mysql"
    host:   "localhost"
    port:   3306
    username: "iotestuser"
    password: "iotest"
    database: "iotest"

  test:
    driver: "mysql"
    host:   "localhost"
    port:   3306
    username: "root"
    password: ""
    database: "io-test_test"

  production:
    driver: "mysql"
    host:   "localhost"
    port:   3306
    username: "root"
    password: ""
    database: "io-test_production"
