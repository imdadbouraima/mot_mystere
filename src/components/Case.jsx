
function Case({ lettre, couleur, delai, animationActive }) {
  return (
    <div
      className={`case ${couleur || ""} ${animationActive ? "case-retournee" : ""}`}
      style={{ animationDelay: `${delai}ms` }}
    >
      {lettre}
    </div>
  );
}

export default Case;
