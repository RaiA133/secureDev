import { useContext } from "react";
import { ResultContext } from "../contexts/resultContextJson";
import { Card, Skeleton, CardHeader, CardBody, Image } from "@nextui-org/react";

import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ResultJson() {
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
          <Card className="min-w-[300px] max-w-[780px] p-0">
            <div className="text-[12px] max-h-[400px] overflow-auto">

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {Object.keys(result).map((vulnerability) => {
                  const {
                    descriptions,
                    levelThereat,
                    typeThereat,
                    filePath,
                    solution,
                    attention
                  } = result[vulnerability];
                  return (
                    <Card key={vulnerability} className="py-4 w-full bg-neutral-800">
                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">{typeThereat}</p>
                        <small className="text-default-500">Level : {levelThereat}</small>
                        <h4 className="font-bold text-large">{vulnerability}</h4>
                      </CardHeader>
                      <CardBody className="overflow-visible py-2 justify-end items-center">
                        <Image
                          alt="Card background"
                          className="object-cover rounded-xl self-end"
                          src="https://nextui.org/images/hero-card-complete.jpeg"
                          width={200}
                        />
                        {/* <div className="mt-4">
                          <p><strong>Description:</strong> {descriptions}</p>
                          <p><strong>Solution:</strong> {solution}</p>
                          <div>
                            <strong>Attention:</strong>
                            <ul>
                              {attention.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div> */}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>



              {/* <Markdown
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
                /> */}
            </div>
          </Card>
        )
      )}

    </>
  );
}

export default ResultJson;
