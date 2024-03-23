const { Pool } = require('pg');
 
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }
 
  async getPlaylistSongsById(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name
        FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlists
        JOIN playlist_songs ON  playlist_songs.playlist_id = playlists.id
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(songsQuery);

    playlist.songs = result.rows;

    return playlist;
  }
}
 
module.exports = PlaylistsService;