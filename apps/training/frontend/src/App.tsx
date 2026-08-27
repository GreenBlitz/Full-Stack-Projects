// בס"ד
import { useState, type FC } from "react";
import { DuckCard } from "./componentsEyal/DuckCard";

const App: FC = () => {
  return (<div>
            <DuckCard DuckName="it that betrays" DuckColor="lightGray" DuckAge={2} />
            <DuckCard DuckName="Ulamog, the Ceaseless Hunger" DuckColor="darkGray" DuckAge={1} />
            <DuckCard DuckName="Emrakul, the Aeons Torn=" DuckColor="" DuckAge={3} />
          </div>);
};

export default App;