import { useEffect,useState } from "react";
import { LineChart, ResponsiveContainer, Line, CartesianGrid,XAxis,YAxis } from "recharts";

export default function SelectableGraph(props) {
  // Return a graph of whatever the key is
  const {data, key} = props;

  const [graphData,setGraphData] = useState([]);

  useEffect(() => {
    // Update the graph data
    const newData = data.map((item) => {
      return {
        x: item.date,
        y: item[key]
      }
    });
    setGraphData(newData);
  },[data, key]);


  return (
    <>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={graphData}>
          <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="x" />
          <YAxis type="number" allowDataOverflow="false"/>
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}
