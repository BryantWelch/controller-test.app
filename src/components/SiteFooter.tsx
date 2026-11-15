import { Link } from 'react-router-dom'
import '../styles/footer.css'

const currentYear = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-columns">
        <section className="site-footer-col">
          <h2>About</h2>
          <ul className="site-footer-links">
            <li>
              <a
                href="https://github.com/BryantWelch/controller-test.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BryantWelch/controller-test.app/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an Issue
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BryantWelch/controller-test.app/pulls"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BryantWelch/controller-test.app/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                Releases
              </a>
            </li>
          </ul>
        </section>

        <section className="site-footer-col">
          <h2>Resources</h2>
          <ul className="site-footer-links">
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <a
                href="https://github.com/AL2009man/Gamepad-Asset-Pack"
                target="_blank"
                rel="noopener noreferrer"
              >
                Controller art (MIT)
              </a>
            </li>
            <li>
              <a
                href="https://controllercons.github.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Controller icons (OFL)
              </a>
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gamepad API
              </a>
            </li>
          </ul>
        </section>

        <section className="site-footer-col">
          <h2>Community</h2>
          <ul className="site-footer-links">
            <li>
              <a
                href="https://www.reddit.com/r/Controller/"
                target="_blank"
                rel="noopener noreferrer"
              >
                r/Controller
              </a>
            </li>
            <li>
              <a
                href="https://www.reddit.com/r/XboxController/"
                target="_blank"
                rel="noopener noreferrer"
              >
                r/XboxController
              </a>
            </li>
            <li>
              <a href="https://www.resetera.com/" target="_blank" rel="noopener noreferrer">
                ResetEra
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="site-footer-copy">
        <p>
          © {currentYear} Controller Test. Open source under{' '}
          <a
            href="https://github.com/BryantWelch/controller-test.app/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </p>
      </div>

      <div className="site-footer-kofi">
        <a href="https://ko-fi.com/V7V01A0SJC" target="_blank" rel="noopener noreferrer">
          <img
            src="https://storage.ko-fi.com/cdn/kofi5.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
    </footer>
  )
}
