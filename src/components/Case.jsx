function Case({ lettre, couleur }) {
  return (
    <div className={`case ${couleur || ""}`}>
      {lettre}
    </div>
  );
}

export default Case;