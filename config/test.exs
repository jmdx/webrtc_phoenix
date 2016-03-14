use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :webrtc_phoenix, WebrtcPhoenix.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :webrtc_phoenix, WebrtcPhoenix.Repo,
  adapter: Ecto.Adapters.MySQL,
  username: "root",
  password: "",
  database: "webrtc_phoenix_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
