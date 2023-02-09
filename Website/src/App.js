import { useEffect, useState } from "react";
import "./App.css";
function dodajscripty() {
  const script1 = document.createElement("script");
  script1.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.js";
  script1.async = true;
  document.body.appendChild(script1);
  const script2 = document.createElement("link");
  script2.rel = "stylesheet";
  script2.href = "https://commons.margonem.pl/css/tipsParser.min.css";
  script2.async = true;
  document.body.appendChild(script2);
  const script3 = document.createElement("script");
  script3.src = "https://dev-commons.margonem.pl/js/tooltips_packedv2.js";
  script3.async = true;
  document.body.appendChild(script3);
  const script4 = document.createElement("script");
  script4.src = "https://commons.margonem.pl/js/dictionaries/dictionary_pl.js";
  script4.async = true;
  document.body.appendChild(script4);
}
function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`http://127.0.0.1:8080/vsMob`)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
        dodajscripty();
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <div className="dropy">
        <h1>Looty</h1>
        {data &&
          data.map(({ ev, itemy, team, enemy }) => (
            <div key={ev} className={"drop"}>
              <div className="itemybox">
                <div className="itemylabel">Itemy:</div>
                <div className="itemycontener">
                  {itemy.map(({ id, icon }) => (
                    <div class="itemborder">
                      <img
                        alt=""
                        src={
                          "https://micc.garmory-cdn.cloud/obrazki/itemy/" + icon
                        }
                        class={"margonem_item margonem_pl_item item_" + id}
                        tip={JSON.stringify(itemy[0])}
                        ctip="item"
                      ></img>
                    </div>
                  ))}
                </div>
              </div>
              <div className="teambox">
                <div className="teamlabel">Drużyna: </div>
                <div className="team">
                  {team.length !== 1
                    ? team.map((player) => player.name) + ","
                    : team.map((player) => player.name)}
                </div>
              </div>
              <div className="enemybox">
                <div className="enemylabel">Zdobytę z:</div>
                <div className="enemy">
                  {enemy.length !== 1
                    ? enemy.map((player) => player.name) + ","
                    : enemy.map((player) => player.name)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default App;
