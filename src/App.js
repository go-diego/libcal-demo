import React from "react";
import { format } from "date-fns";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getEvents, getToken, getCalendars } from "./lib/libcal";

import "./App.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 992 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 991, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

function CarouselDot({ onClick, active, index, carouselState }) {
  return (
    <button
      onClick={onClick}
      aria-label="button"
      className={`carousel-dot${active ? " active" : " inactive"}`}
    />
  );
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    // TODO: use useSWR
    async function fetchData() {
      try {
        //TODO: only get token if other is expired
        const token = await getToken();
        const calendars = await getCalendars(token);
        const events = await getEvents(token, calendars.calendars[0].calid);
        setEvents(events.events);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section className="events-root">
      <div className="container" style={{ width: "100%" }}>
        <h1 className="is-size-3 has-text-centered has-text-white">
          Campus Name Events
        </h1>
        {isLoading && (
          <p className="pt-6 is-size-5 has-text-centered has-text-white">
            Loading...
          </p>
        )}
        {!isLoading && (
          <Carousel
            customDot={<CarouselDot />}
            arrows={false}
            // customLeftArrow={<LeftArrow />}
            // customRightArrow={<RightArrow />}
            swipeable={true}
            draggable={false}
            showDots={true}
            responsive={responsive}
            infinite={true}
            keyBoardControl={true}
            containerClass=" py-6"
            minimumTouchDrag={10}
            itemClass="px-2 "
          >
            {events.map((event, index) => {
              return (
                <div key={event.id} className="event-card card">
                  <div className="card-content p-3">
                    <div className="columns is-1 is-variable">
                      <div className="column is-narrow">
                        <div className="event-date p-1 is-flex is-flex-direction-column has-background-primary has-text-white is-justify-content-center is-align-items-center">
                          <span className="is-uppercase is-size-5">
                            {format(new Date(event.start), "MMM")}
                          </span>
                          <span className="has-text-weight-bold is-size-1">
                            {format(new Date(event.start), "dd")}
                          </span>
                        </div>
                      </div>
                      <div className="column">
                        <p className="has-text-centered title is-size-5 mb-2">
                          {event.title}
                        </p>
                        <div className="event-time has-text-centered is-capitalized is-size-6">
                          {`${format(
                            new Date(event.start),
                            "K:mm aa"
                          )}-${format(new Date(event.end), "KK:mm aa")}`}
                        </div>
                      </div>
                    </div>
                    {event.audience && (
                      <div className="pt-1 audience tags are-medium">
                        {event.audience.map((item) => {
                          return (
                            <span key={item.id} className="tag is-dark">
                              {item.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </Carousel>
        )}
        <div className="is-flex is-justify-content-flex-end">
          <a href="/" className="has-text-white is-size-5">
            View Full Calendar &#129122;
          </a>
        </div>
      </div>
    </section>
  );
}

export default App;
