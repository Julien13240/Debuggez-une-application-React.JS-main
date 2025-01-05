import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

function compareDate(eventA, eventB) { // Sert à comparer les deux objets en fonction de leurs dates
  return new Date(eventA.date) - new Date(eventB.date)
}
const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);   // Création d'un nouvel état
  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData()

      const sortedEvents = loadedData.events.sort(compareDate) // CompareData est utilisé comme callBack de la method sort.
      //  Le ".sort" utilise la fonction "compareData"

      setData(loadedData);
      setLast(sortedEvents.at(-1)) // Récupération de la valeur à l'index donné: index négatif = commencer par la fin de l'array

    } catch (err) {

      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
