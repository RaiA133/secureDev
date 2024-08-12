import { useContext, useState } from "react";
import { ResultContext } from "../contexts/resultContextJson";
import { GenerateCodeChanges } from "../contexts/generateCodeChanges";
import {
  Skeleton, // loading handler
  Button, Divider,
  Card, CardHeader, CardBody, Image, // card
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, // modal
} from "@nextui-org/react";

import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ResultJson() {
  const { result, isLoading, isError, dataset } = useContext(ResultContext);
  const { setPreDataGenCodeChanges, setDataSetFiltered, isLoadingCodeChanges, resultCodeChange } = useContext(GenerateCodeChanges);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // modal 

  const handleCardClick = (vulnerabilityData) => {
    setSelectedVulnerability(vulnerabilityData);
    onOpen()
  };

  const handleGenCodeChangeSubmit = () => {
    const filteredData = dataset.code.filter(file => // Filter dataset based on selectedVulnerability.filePath
      selectedVulnerability.filePath.includes(file.filePath)
    );
    setPreDataGenCodeChanges(selectedVulnerability);
    setDataSetFiltered(filteredData);  // Update the context with the filtered dataset
  }

  const determineThreatClass = (levelThereat) => {
    // console.log(levelThereat);
    let threatClass = "";
    if (levelThereat) {
      switch (levelThereat) {
        case "info":
          threatClass = "text-white-500";
          break;
        case "low":
          threatClass = "text-blue-500";
          break;
        case "medium":
          threatClass = "text-green-500";
          break;
        case "high":
          threatClass = "text-orange-500";
          break;
        case "critical":
          threatClass = "text-red-500";
          break;
        default:
          threatClass = ""; // Optional: Add a default class or leave it empty
      }
    }
    return threatClass;
  };

  console.log("isError", isError);

  return (
    <>

      {/* Handle the error state */}
      {isError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold">Error</h2>
          <p>An error occurred while fetching the data. Please try again.</p>
        </div>
      )}

      {isLoading ? (
        <Card className="min-w-[300px] max-w-[780px] p-5 pb-10 flex flex-row gap-3">

          <Card className="w-full space-y-5 p-4" radius="lg">
            <div className="space-y-3">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-1/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-14 rounded-lg bg-default-300"></div>
            </Skeleton>
          </Card>

          <Card className="w-full space-y-5 p-4" radius="lg">
            <div className="space-y-3">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-1/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-14 rounded-lg bg-default-300"></div>
            </Skeleton>
          </Card>

          <Card className="w-full space-y-5 p-4" radius="lg">
            <div className="space-y-3">
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-1/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
            </div>
            <Skeleton className="rounded-lg">
              <div className="h-14 rounded-lg bg-default-300"></div>
            </Skeleton>
          </Card>

        </Card >
      ) : (
        result && (
          <Card className="min-w-[300px] max-w-full p-5">
            <div className="text-[12px] max-h-[600px] overflow-auto">

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {Object.keys(result)
                  .sort((a, b) => {
                    const order = ["critical", "high", "medium", "low", "info"];
                    return order.indexOf(result[a].levelThereat) - order.indexOf(result[b].levelThereat);
                  })
                  .map((vulnerability) => {
                    const {
                      descriptions,
                      levelThereat,
                      typeThereat,
                      filePath,
                      solution,
                      attention
                    } = result[vulnerability] || {}; // Default to an empty object if result[vulnerability] is undefined

                    const threatClass = determineThreatClass(levelThereat);

                    return (
                      <Card key={vulnerability} className="py-4 w-full bg-neutral-800">

                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start cursor-pointer"
                          onClick={() => handleCardClick({
                            vulnerability,
                            descriptions,
                            levelThereat,
                            typeThereat,
                            filePath,
                            solution,
                            attention,
                            threatClass
                          })}
                        >
                          <p className="text-md uppercase font-bold mb-1">{typeThereat}</p>
                          <small className="text-default-800 mb-2">
                            Level : <span className={`font-bold ${threatClass}`}>{levelThereat}</span>
                          </small>
                          <h4 className="font-bold text-large">{vulnerability}</h4>
                        </CardHeader>

                        <Modal
                          placement='top'
                          size='4xl'
                          backdrop='blur'
                          isOpen={isOpen}
                          onOpenChange={onOpenChange}
                          classNames={{
                            body: "py-6",
                            base: "border-[#292f46] bg-[#27272A] dark:bg-[#27272A] text-white",
                            header: "border-b-[1px] border-[#292f46]",
                            footer: "border-t-[1px] border-[#292f46]",
                            closeButton: "hover:bg-white/5 active:bg-white/10",
                          }}
                        >
                          <ModalContent>
                            {(onClose) => (
                              <>
                                <ModalHeader className="flex flex-row justify-between gap-2 text-2xl">
                                  {selectedVulnerability.vulnerability}
                                  <div className="text-tiny p-0 text-end pr-7">
                                    <p className="uppercase font-bold">{selectedVulnerability.typeThereat}</p>
                                    <small className="text-default-100">Level of Thereat : <span className={`font-bold ${selectedVulnerability.threatClass}`}>{selectedVulnerability.levelThereat}</span></small>
                                  </div>
                                </ModalHeader>
                                <ModalBody>

                                  <div className="text-sm">

                                    <div className="max-h-[350px] pr-3 overflow-y-auto">
                                      <div>
                                        <strong>File path:</strong>
                                        <ul>
                                          {selectedVulnerability.filePath.map((item, index) => (
                                            <li key={index}><i>- {item}</i></li>
                                          ))}
                                        </ul>
                                      </div> <br />
                                      <p><strong>Description:</strong> {selectedVulnerability.descriptions}</p> <br />
                                      <p><strong>Solution:</strong> {selectedVulnerability.solution}</p> <br />
                                      <div>
                                        <strong>Attention:</strong>
                                        <ul>
                                          {selectedVulnerability.attention.map((item, index) => (
                                            <li key={index}>- {item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                  </div>

                                  <Divider className='my-2 bg-white' />

                                  <Button color="default" onClick={() =>
                                    handleGenCodeChangeSubmit()
                                  }> <b>Generate Code Changes</b> </Button>

                                  <div className="dark text-foreground bg-background rounded-2xl">

                                    {isLoadingCodeChanges ? (
                                      <Card className="space-y-5 p-4 w-full" radius="lg">
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
                                          <Skeleton className="w-3/5 rounded-lg">
                                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                          </Skeleton>
                                          <Skeleton className="w-4/5 rounded-lg">
                                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                          </Skeleton>
                                          <Skeleton className="w-4/5 rounded-lg">
                                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                          </Skeleton>
                                        </div>
                                      </Card>
                                    ) : (
                                      resultCodeChange[selectedVulnerability.vulnerability] && (
                                        <Card className="min-w-[300px] w-full p-5">
                                          <div className="w-full space-y-5">
                                            <div className="text-[12px] max-h-[400px] overflow-auto pr-3">
                                              <Markdown
                                                children={resultCodeChange[selectedVulnerability.vulnerability]}
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

                                  </div>

                                </ModalBody>
                                <ModalFooter>
                                  <Button color="secondary" variant="light" className="text-white" onPress={onClose}>
                                    Close
                                  </Button>
                                </ModalFooter>
                              </>
                            )}
                          </ModalContent>
                        </Modal>


                      </Card>
                    );
                  })}
              </div>

            </div>
          </Card>
        )
      )}

    </>
  );
}

export default ResultJson;
