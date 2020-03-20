import { Link } from '../routes'
import slug from '../helpers/slug'

export default class PodcastList extends React.Component {
  render () {
    const { title, podcastList, onClickPodcast } = this.props;
    return <>
      <h2>{title}</h2>
      {podcastList.map(clip => (
        <Link
          route="podcast"
          params={{
            slug: slug(clip.title),
            id: clip.id,
            slugChannel: slug(clip.channel.title),
            idChannel: clip.channel.id,
          }}
          key={clip.id}
        >
          <a className='podcast' onClick={(e) => onClickPodcast(e, clip)}>
            <h3>{ clip.title }</h3>
            <div className='meta'>
              { Math.ceil(clip.duration / 60) } minutes
            </div>
          </a>
        </Link>
        ))
      }
      
      <style jsx>{`
        h2 {
          padding: 15px;
          font-size: 2rem;
          font-weight: 600;
          margin 0;
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

    </>
  }
} 