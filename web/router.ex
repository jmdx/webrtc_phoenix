defmodule WebrtcPhoenix.Router do
  use WebrtcPhoenix.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :put_secure_browser_headers
  end

  pipeline :csrf do
    plug :protect_from_forgery # to here
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", WebrtcPhoenix do
    pipe_through [:browser, :csrf]
    get "/", PageController, :index
    get "/join", PageController, :join
  end

  scope "/", WebrtcPhoenix do
    pipe_through [:browser] # We don't need csrf protection for room creation
    post "/create", PageController, :create
  end

  # Other scopes may use custom stacks.
  # scope "/api", WebrtcPhoenix do
  #   pipe_through :api
  # end
end
