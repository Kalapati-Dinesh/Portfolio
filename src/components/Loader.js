import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-name">
          <span className="ln-k">K</span>
          <span className="ln-d">D</span>
        </div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" />
        </div>
        <p className="loader-sub">Portfolio Loading</p>
      </div>
    </div>
  );
}
