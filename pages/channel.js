import 'isomorphic-fetch'
import Link from 'next/link'
import Layout from '../components/Layout'

export default class extends React.Component {

  static async getInitialProps({ query }) {
    const { id } = query

    const [reqChannel, reqAudios, reqSeries] = await Promise.all([
      fetch(`https://api.audioboom.com/channels/${id}`),
      fetch(`https://api.audioboom.com/channels/${id}/audio_clips`),
      fetch(`https://api.audioboom.com/channels/${id}/child_channels`)
    ])

    const [dataChannel, dataAudios, dataSeries] = await Promise.all([
      reqChannel.json(),
      reqAudios.json(),
      reqSeries.json()
    ])

    const channel = dataChannel.body.channel;
    const audioClips = dataAudios.body.audio_clips;
    const series = dataSeries.body.channels;

    return { channel, audioClips, series }
  }

  render() {
    const { channel, audioClips, series } = this.props;
    return (<Layout title="Podcasts">
      <h1>{channel.title}</h1>
      <h2>Ultimos podcasts</h2>

      {audioClips.map(clip => (
        <Link href={`/podcast?id=${clip.id}`} key={clip.id}>
          <a>{clip.title}</a>
        </Link>
      ))}

      <h2>Series</h2>
      {series.map(serie => (
        <div>{serie.title}</div>
      ))}

      <style jsx>{`
        header {
          color: #fff;
          background: #8756ca;
          padding: 15px;
          text-align: center;
        }

        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }

        .channels {
          display: grid;
          grid-gap: 15px;
          padding: 15px;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        a.channel {
          display: block;
          margin-bottom: 0.5em;
          color: #333;
          text-decoration: none;
        }
        .channel img {
          border-radius: 3px;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
          width: 100%;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 5px;
          font-size: 0.9em;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .podcast {
          display: block;
          text-decoration: none;
          color: #333;
          padding: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .podcast:hover {
          color: #000;
        }
        .podcast h3 {
          margin: 0;
        }
        .podcast .meta {
          color: #666;
          margin-top: 0.5em;
          font-size: 0.8em;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui;
          background: white;
        }
      `}</style>
    </Layout>
    )
  }
}