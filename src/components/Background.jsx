export default function Background({ contoursElRef, contoursSvgRef, glowElRef }) {
  return (
    <>
      <div className="page-glow" ref={glowElRef} aria-hidden="true"></div>
      <div className="page-contours" ref={contoursElRef} aria-hidden="true">
        <svg ref={contoursSvgRef} viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false"></svg>
      </div>
    </>
  );
}
