import 'isomorphic-fetch'
import Error from './_error'
import Layout from '../components/Layout'
import PodcastList from '../components/PodcatList'
import ChannelGrid from '../components/ChannelGrid'

export default class extends React.Component {

  static async getInitialProps({ query, res }) {
    try {
      const { id } = query
  
      const [reqChannel, reqAudios, reqSeries] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${id}`),
        fetch(`https://api.audioboom.com/channels/${id}/audio_clips`),
        fetch(`https://api.audioboom.com/channels/${id}/child_channels`)
      ])

      if (reqChannel.status >= 400) {
        res.statusCode = reqChannel.status
        return { channel: null, audioClips: null, series: null, statusCode: reqChannel.status }
      }
  
      const [dataChannel, dataAudios, dataSeries] = await Promise.all([
        reqChannel.json(),
        reqAudios.json(),
        reqSeries.json()
      ])
  
      const channel = dataChannel.body.channel;
      const audioClips = dataAudios.body.audio_clips;
      const series = dataSeries.body.channels;
  
      return { channel, audioClips, series, statusCode: 200 }
    } catch (error) {
      res.statusCode = 503
      return { channel: null, audioClips: null, series: null, statusCode: 503 }
    }
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />
    }

    return (<Layout title={channel.title}>
      <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

      { series.length > 0 &&
        <ChannelGrid title="Series" channels={series}/>
      }

      <PodcastList title="Ultimos Podcasts" podcastList={audioClips} />

      <style jsx>{`
        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }
      `}</style>
    </Layout>
    )
  }
}