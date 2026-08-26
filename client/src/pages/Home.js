import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Arrow = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="sv-home">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="sv-hero">

        <div className="sv-hero-grid" />

        <div className="sv-hero-content">

          <div className="sv-overline">
            <span className="sv-live-dot" />
            AUTONOMOUS HEALTHCARE PLATFORM
          </div>

          <h1>
            Healthcare,
            <br />
            <em>delivered precisely.</em>
          </h1>

          <p className="sv-hero-description">
            A connected vaccination system combining computer vision,
            autonomous delivery and robotic precision — with human
            oversight at every critical step.
          </p>

          <div className="sv-hero-actions">

            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="sv-button sv-button-dark">
                  Open dashboard
                  <Arrow />
                </Link>

                <Link to="/book-vaccination" className="sv-button sv-button-light">
                  Book vaccination
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="sv-button sv-button-dark">
                  Get started
                  <Arrow />
                </Link>

                <Link to="/how-it-works" className="sv-button sv-button-light">
                  Explore system
                </Link>
              </>
            )}

          </div>

          <div className="sv-hero-meta">

            <span>
              <b>01</b>
              AI VISION
            </span>

            <span>
              <b>02</b>
              AUTONOMOUS FLIGHT
            </span>

            <span>
              <b>03</b>
              ROBOTIC PRECISION
            </span>

          </div>

        </div>


        {/* =====================================================
            MISSION INTERFACE
        ===================================================== */}

        <div className="sv-mission">

  <div className="sv-mission-window">

    <div className="sv-window-header">

      <div>
        <span>MISSION STATUS</span>
        <strong>READY FOR DEPLOYMENT</strong>
      </div>

      <div className="sv-online">
        <i />
        LIVE
      </div>

    </div>


    <div className="sv-map">

      <div className="sv-map-grid" />

      <div className="sv-map-crosshair horizontal" />
      <div className="sv-map-crosshair vertical" />

      <div className="sv-radar radar-a" />
      <div className="sv-radar radar-b" />

      {/* DRONE */}

      <div className="sv-drone">

        <div className="drone-body">

          <div className="drone-light" />

          <div className="drone-cockpit" />

          <div className="drone-arm drone-arm-left" />
          <div className="drone-arm drone-arm-right" />

          <div className="drone-prop prop-one" />
          <div className="drone-prop prop-two" />
          <div className="drone-prop prop-three" />
          <div className="drone-prop prop-four" />

        </div>

      </div>


      {/* FLIGHT PATH */}

      <div className="flight-path" />

      {/* DESTINATION */}

      <div className="location-point">
        <span />
      </div>


      <div className="sv-coordinate coordinate-one">
        16.7050° N
      </div>

      <div className="sv-coordinate coordinate-two">
        74.2433° E
      </div>

    </div>


    <div className="sv-mission-footer">

      <div>
        <small>AI STATUS</small>
        <strong className="green">OPERATIONAL</strong>
      </div>

      <div>
        <small>VISION</small>
        <strong>READY</strong>
      </div>

      <div>
        <small>ARM</small>
        <strong>STANDBY</strong>
      </div>

      <div>
        <small>MISSION</small>
        <strong>READY</strong>
      </div>

    </div>

  </div>


  {/* TOP FLOATING CARD */}

  <div className="sv-floating-card sv-card-top">

    <span className="sv-card-symbol">
      AI
    </span>

    <div>
      <small>VISION ENGINE</small>
      <strong>ONLINE</strong>
    </div>

  </div>


  {/* BOTTOM FLOATING CARD */}

  <div className="sv-floating-card sv-card-bottom">

    <span className="sv-card-symbol verified">
      <Check />
    </span>

    <div>
      <small>SAFETY CONTROL</small>
      <strong>HUMAN VERIFIED</strong>
    </div>

  </div>

</div>

      </section>


      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="sv-statement">

        <div className="sv-section-index">
          01 / SYSTEM
        </div>

        <div className="sv-statement-grid">

          <h2>
            One platform.
            <br />
            <span>Multiple intelligent layers.</span>
          </h2>

          <div>
            <p>
              Smart Vaccination System connects patient verification,
              computer vision, autonomous navigation and robotic
              assistance into one coordinated workflow.
            </p>

            <Link to="/how-it-works" className="sv-text-link">
              Understand the workflow
              <Arrow />
            </Link>
          </div>

        </div>

      </section>


      {/* =====================================================
          ARCHITECTURE
      ===================================================== */}

      <section className="sv-architecture">

        <div className="sv-section-heading">

          <div>
            <span className="sv-section-index">
              02 / ARCHITECTURE
            </span>

            <h2>
              Engineered around
              <br />
              <span>precision.</span>
            </h2>
          </div>

          <p>
            Every layer has a defined responsibility. Intelligence
            assists the process while critical actions remain under
            controlled human supervision.
          </p>

        </div>


        <div className="sv-architecture-grid">

          {/* AI */}

          <article className="sv-tech sv-tech-dark">

            <div className="sv-tech-number">
              01
            </div>

            <div className="sv-tech-visual sv-face-interface">

              <div className="sv-face-grid" />

              <div className="sv-face-box">

                <div className="sv-face-head">
                  <span className="eye left" />
                  <span className="eye right" />
                </div>

                <div className="sv-face-body" />

              </div>

              <div className="sv-scan-line" />

              <div className="sv-face-data">
                <span>IDENTITY</span>
                <strong>VERIFIED</strong>
              </div>

            </div>

            <div className="sv-tech-copy">

              <span>COMPUTER VISION</span>

              <h3>
                Identity,
                <br />
                verified intelligently.
              </h3>

              <p>
                AI-assisted facial verification establishes patient
                identity before the vaccination workflow proceeds.
              </p>

              <Link to="/ml-models" className="sv-text-link">
                Explore vision models
                <Arrow />
              </Link>

            </div>

          </article>


          {/* DRONE */}

          <article className="sv-tech sv-tech-light">

            <div className="sv-tech-number">
              02
            </div>

            <div className="sv-route-interface">

              <div className="route-grid" />

              <div className="route-circle circle-one" />
              <div className="route-circle circle-two" />

              <div className="route-path" />

              <span className="route-point point-one" />
              <span className="route-point point-two" />

              <span className="route-label label-a">
                BASE
              </span>

              <span className="route-label label-b">
                PATIENT
              </span>

              <span className="route-aircraft">
                +
              </span>

            </div>

            <div className="sv-tech-copy">

              <span>AUTONOMOUS DELIVERY</span>

              <h3>
                Access without
                <br />
                infrastructure.
              </h3>

              <p>
                GPS-guided navigation allows the platform to reach
                designated locations while continuously tracking
                mission status.
              </p>

            </div>

          </article>


          {/* DELTOID */}

          <article className="sv-tech sv-tech-light">

            <div className="sv-tech-number">
              03
            </div>

            <div className="sv-shoulder-interface">

              <div className="sv-body-model">

                <div className="sv-head" />

                <div className="sv-torso" />

                <div className="sv-target">
                  <span />
                </div>

              </div>

              <div className="sv-target-line" />

              <span className="sv-target-text">
                TARGET REGION
              </span>

            </div>

            <div className="sv-tech-copy">

              <span>PRECISION VISION</span>

              <h3>
                Locate the
                <br />
                intended region.
              </h3>

              <p>
                Computer vision assists in identifying the intended
                deltoid region for the next stage of the workflow.
              </p>

            </div>

          </article>


          {/* ROBOT */}

          <article className="sv-tech sv-tech-wide sv-tech-dark">

            <div className="sv-tech-number">
              04
            </div>

            <div className="sv-robot-interface">

              <div className="robot-base" />

              <div className="robot-joint joint-a" />
              <div className="robot-joint joint-b" />

              <div className="robot-arm-segment segment-a" />
              <div className="robot-arm-segment segment-b" />

              <div className="robot-end-effector" />

              <div className="robot-label">
                6-DOF ROBOTIC SYSTEM
              </div>

            </div>

            <div className="sv-tech-copy">

              <span>ROBOTIC PRECISION</span>

              <h3>
                Physical precision,
                <br />
                controlled by design.
              </h3>

              <p>
                A 6-DOF robotic arm forms the physical automation
                layer while the operator retains final control.
              </p>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="sv-workflow">

        <div className="sv-workflow-heading">

          <span className="sv-section-index">
            03 / WORKFLOW
          </span>

          <h2>
            From request
            <br />
            to <span>vaccination.</span>
          </h2>

        </div>


        <div className="sv-workflow-list">

          <div className="sv-workflow-item">

            <span>01</span>

            <div>
              <strong>REGISTER</strong>
              <p>
                Patient identity and required information are registered.
              </p>
            </div>

          </div>


          <div className="sv-workflow-item">

            <span>02</span>

            <div>
              <strong>REQUEST</strong>
              <p>
                The patient schedules and submits a vaccination request.
              </p>
            </div>

          </div>


          <div className="sv-workflow-item">

            <span>03</span>

            <div>
              <strong>VERIFY</strong>
              <p>
                AI-assisted identity and target-region analysis is performed.
              </p>
            </div>

          </div>


          <div className="sv-workflow-item">

            <span>04</span>

            <div>
              <strong>APPROVE</strong>
              <p>
                The operator reviews the system state before proceeding.
              </p>
            </div>

          </div>


          <div className="sv-workflow-item">

            <span>05</span>

            <div>
              <strong>EXECUTE</strong>
              <p>
                The robotic system performs the controlled physical action.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HUMAN CONTROL
      ===================================================== */}

      <section className="sv-control">

        <div className="sv-control-panel">

          <div className="sv-control-copy">

            <span className="sv-section-index">
              04 / SAFETY
            </span>

            <h2>
              Automation
              <br />
              needs
              <br />
              <span>human control.</span>
            </h2>

            <p>
              The system follows a human-in-the-loop architecture.
              Automated intelligence supports decisions, but critical
              actions require operator confirmation.
            </p>

            <div className="sv-check-list">

              <div>
                <span><Check /></span>
                Operator approval before injection
              </div>

              <div>
                <span><Check /></span>
                Real-time mission monitoring
              </div>

              <div>
                <span><Check /></span>
                Authenticated system access
              </div>

            </div>

          </div>


          <div className="sv-control-visual">

            <div className="sv-control-grid" />

            <div className="sv-control-circle circle-large" />
            <div className="sv-control-circle circle-medium" />
            <div className="sv-control-circle circle-small" />

            <div className="sv-control-core">

              <span>CONTROL</span>

              <strong>ACTIVE</strong>

              <small>HUMAN IN THE LOOP</small>

            </div>

            <div className="control-node node-ai">
              AI
            </div>

            <div className="control-node node-human">
              HUMAN
            </div>

            <div className="control-node node-robot">
              ARM
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      {!isAuthenticated() && (

        <section className="sv-final">

          <div className="sv-final-grid" />

          <span className="sv-section-index">
            05 / BEGIN
          </span>

          <h2>
            Healthcare should
            <br />
            <span>reach everyone.</span>
          </h2>

          <p>
            Explore the platform and see how AI, autonomous systems
            and robotics can work together in a controlled healthcare
            workflow.
          </p>

          <Link
            to="/register"
            className="sv-button sv-button-white"
          >
            Create an account
            <Arrow />
          </Link>

        </section>

      )}

    </div>
  );
};

export default Home;