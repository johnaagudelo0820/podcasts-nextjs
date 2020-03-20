import 'isomorphic-fetch'
import Error from './_error'
import Layout from '../components/Layout'
import PodcastList from '../components/PodcatList'
import ChannelGrid from '../components/ChannelGrid'
import PodcastPlayer from '../components/PodCastPlayer'

export default class extends React.Component {

  constructor(props){
    super(props)
    this.state = { openPodcast: null }
  }

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

  openPodcast = (event, podcast) => {
    event.preventDefault()
    this.setState({
      openPodcast: podcast
    })
  }

  closePodcast = (event) => {
    event.preventDefault()
    this.setState({
      openPodcast: null
    })
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props
    const { openPodcast } = this.state

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />
    }

    return (<Layout title={channel.title}>
      <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

      {openPodcast && 
        <div className="modal">
          <PodcastPlayer clip={openPodcast} onClose={this.closePodcast} />
        </div>}

      { series.length > 0 &&
        <ChannelGrid title="Series" channels={series}/>
      }

      <PodcastList
        title="Ultimos Podcasts"
        podcastList={audioClips}
        onClickPodcast={this.openPodcast}
      />

      <style jsx>{`
        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          background: black;
        }
      `}</style>
    </Layout>
    )
  }
}