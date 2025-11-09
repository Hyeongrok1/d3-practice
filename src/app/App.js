import './App.css';
import MyScatterplot from './components/scatter';

function App() {
  // const [featureExplains, setFeatureExplains] = useState(null); 
  // const givenFeatureId = 0;
  // useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const data = await getFeatureExplain(givenFeatureId); 
          
  //         setFeatureExplains(data);
  //       } catch (error) {
  //         console.error("Failed to fetch feature explains:", error);
  //       }
  //     };
      
  //     fetchData();
      
  //   }, [givenFeatureId]); 

  // if (featureExplains === null) {
  //   return <div>Loading data...</div>;
  // }
  // console.log(featureExplains)

  return (
    <div className="App">
      
      <header className="App-header">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
        rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous"/>

        {/* <button className="btn btn-primary" id="update">get Explains!</button> */}
        <MyScatterplot></MyScatterplot>
      </header>
    </div>
  );
}

export default App;
