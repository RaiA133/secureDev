import React, { useContext, useState, Suspense, lazy, useCallback } from 'react';
import { ResultContext } from '../contexts/resultContextJson';
import { GenerateCodeChanges } from '../contexts/generateCodeChanges';
import {
  Skeleton,
  Button, Divider,
  Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from '@nextui-org/react';

const Markdown = lazy(() => import('react-markdown'));
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


function ResultJson() {
  const { result, isLoading, isError, dataset } = useContext(ResultContext);
  const { setPreDataGenCodeChanges, setDataSetFiltered, isLoadingCodeChanges, resultCodeChange } = useContext(GenerateCodeChanges);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCardClick = useCallback((vulnerabilityData) => {
    setSelectedVulnerability(vulnerabilityData);
    onOpen();
  }, [onOpen]);

  const handleGenCodeChangeSubmit = useCallback(() => {
    const filteredData = dataset.code.filter(file =>
      selectedVulnerability.filePath.includes(file.filePath)
    );
    setPreDataGenCodeChanges(selectedVulnerability);
    setDataSetFiltered(filteredData);
  }, [dataset, selectedVulnerability, setDataSetFiltered, setPreDataGenCodeChanges]);

  const threatClasses = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
    info: 'text-blue-500'
  };

  return (
    <>
      {isError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold">Error</h2>
          <p>An error occurred while fetching the data. Please try again.</p>
        </div>
      )}

      {isLoading ? (
        <Card className="min-w-[300px] max-w-[780px] p-5 pb-10 flex flex-row gap-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="w-full space-y-5 p-4" radius="lg">
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
          ))}
        </Card>
      ) : (
        result && (
          <Card className="min-w-[300px] max-w-full p-5 mb-7">
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
                    } = result[vulnerability] || {};

                    const threatClass = threatClasses[levelThereat] || 'text-gray-500';

                    return (
                      <Card key={vulnerability} className="py-4 w-full bg-neutral-800">
                        <CardHeader
                          className="pb-0 pt-2 px-4 flex-col items-start cursor-pointer"
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
                      </Card>
                    );
                  })}
              </div>
            </div>
          </Card>
        )
      )}

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
          {onClose => (
            <>
              <ModalHeader className="flex flex-row justify-between gap-2 text-2xl">
                {selectedVulnerability?.vulnerability || 'Loading...'}
                <div className="text-tiny p-0 text-end pr-7">
                  <p className="uppercase font-bold">{selectedVulnerability?.typeThereat || ''}</p>
                  <small className="text-default-100">
                    Level of Threat : <span className={`font-bold ${selectedVulnerability?.threatClass || 'text-gray-500'}`}>{selectedVulnerability?.levelThereat || ''}</span>
                  </small>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="text-sm">
                  <div className="max-h-[350px] pr-3 overflow-y-auto">
                    <div>
                      <strong>File path:</strong>
                      <ul>
                        {selectedVulnerability?.filePath.map((item, index) => (
                          <li key={index}><i>- {item}</i></li>
                        ))}
                      </ul>
                    </div> <br />
                    <p><strong>Description:</strong> {selectedVulnerability?.descriptions}</p> <br />
                    <p><strong>Solution:</strong> {selectedVulnerability?.solution}</p> <br />
                    <div>
                      <strong>Attention:</strong>
                      <ul>
                        {selectedVulnerability?.attention.map((item, index) => (
                          <li key={index}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Divider className='my-2 bg-white' />

                <Button color="default" onClick={handleGenCodeChangeSubmit}> <b>Generate Code Changes</b> </Button>

                <div className="dark text-foreground bg-background rounded-2xl">
                  {isLoadingCodeChanges ? (
                    <Card className="space-y-5 p-4 w-full" radius="lg">
                      <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <Skeleton key={idx} className={`w-${idx % 2 === 0 ? '3/5' : '4/5'} rounded-lg`}>
                            <div className={`h-3 w-${idx % 2 === 0 ? '3/5' : '4/5'} rounded-lg bg-default-${idx % 2 === 0 ? '200' : '300'}`}></div>
                          </Skeleton>
                        ))}
                      </div>
                    </Card>
                  ) : (
                    resultCodeChange[selectedVulnerability?.vulnerability] && (
                      <Card className="min-w-[300px] w-full p-5">
                        <div className="w-full space-y-5">
                          <div className="text-[12px] max-h-[400px] overflow-auto pr-3">
                            <Suspense fallback={<Skeleton />}>
                              <Markdown
                                children={resultCodeChange[selectedVulnerability?.vulnerability]}
                                components={{
                                  code(props) {
                                    const { children, className, ...rest } = props;
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                      <Suspense fallback={<Skeleton />}>
                                        <SyntaxHighlighter
                                          style={a11yDark}
                                          language={match[1]}
                                          PreTag="div"
                                          {...rest}
                                        >
                                          {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                      </Suspense>
                                    ) : (
                                      <code {...props} />
                                    );
                                  }
                                }}
                              />
                            </Suspense>
                          </div>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button auto flat color="error" onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ResultJson;
