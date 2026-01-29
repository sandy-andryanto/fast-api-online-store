import { Fragment } from "react"
import moment from 'moment'

interface Activity {
  event: string,
  description: string,
  created_at: string
}

interface Props {
  rows?: Array<Activity>
}

const TimelineComponent = ({ rows }: Props) => {
  return (
    <Fragment>
      <section className="bsb-timeline-1 py-5 py-xl-8">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-md-8 col-xl-6">
              <ul className="timeline">
                {rows?.map((item: Activity, index: number) => {
                  return (
                    <li className="timeline-item" key={index}>
                      <div className="timeline-body">
                        <div className="timeline-content">
                          <div className="card border-0 bg-primary text-white">
                            <div className="card-body">
                              <small className="card-subtitle text-secondary mb-1 d-block text-white">{moment(item.created_at).format("DD-MM-YYYY HH:mm:ss")}</small>
                              <p className="card-text m-0"><small>{item.event} - {item.description}</small></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default TimelineComponent