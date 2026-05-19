export function MathFormula() {
  return (
    <div className="math-formula" aria-label="Formel für den Durchlässigkeitsbeiwert">
      <span className="formula-symbol">k<sub>f</sub> =</span>
      <span className="fraction main-fraction">
        <span className="top">l · b · (h<sub>Anf</sub> − h<sub>Ende</sub>)</span>
        <span className="bottom denominator">
          <span>t ·</span>
          <span className="large-bracket">[</span>
          <span>l · b +</span>
          <span className="large-brace">&#123;</span>
          <span>2 · (l + b) ·</span>
          <span className="large-paren">(</span>
          <span>h<sub>Ende</sub> +</span>
          <span className="fraction inline-fraction">
            <span className="top">h<sub>Anf</sub> − h<sub>Ende</sub></span>
            <span className="bottom">2</span>
          </span>
          <span className="large-paren">)</span>
          <span className="large-brace">&#125;</span>
          <span className="large-bracket">]</span>
        </span>
      </span>
      <span className="formula-unit">m/s</span>
    </div>
  );
}
