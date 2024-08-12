import { useContext } from "react";
import { ResultContext } from "../contexts/resultContextMd";
import { Card, Skeleton } from "@nextui-org/react";
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ResultMd() {
  const { result, isLoading } = useContext(ResultContext);
  
  return (
    <>

      {isLoading ? (
        <Card className="min-w-[300px] max-w-[780px] p-5 pb-10">
          <Card className="w-full space-y-5 p-4" radius="lg">
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
          </Card>
        </Card >
      ) : (
        result && (
          <Card className="min-w-[300px] max-w-[780px] p-5">
            <div className="w-full space-y-5">
              <div className="text-[12px] max-h-[400px] overflow-auto pr-3">
                <Markdown
                  children={result}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={a11yDark}
                          showLineNumbers
                        />
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              </div>
            </div>
          </Card>
        )
      )}

    </>
  );
}

export default ResultMd;
