defmodule WebrtcPhoenix.PageController do
  use WebrtcPhoenix.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def create(conn, _params) do
    # TODO come up with a more robust id system, avoid collisions - right now each start has same seed
    {:ok, connectionData, _conn_details} = Plug.Conn.read_body(conn)
    roomId = Integer.to_string(:random.uniform(10000))
    IO.inspect(connectionData)
    :ets.insert(:rooms, {roomId, connectionData})
    json conn, %{roomId: roomId}
  end

  def join(conn, %{"roomId" => roomId}) do
    # TODO direct to a proper error page instead of index.html
    case :ets.lookup(:rooms, roomId) do
      [{_roomId, connectionData} | _rest] ->
        render conn, "join.html", connectionData: connectionData
      _ -> render conn, "index.html"
    end
  end
end
