import { useContext, useState } from "react";
import { ResultContext } from "../contexts/resultContextJson";
import {
  Skeleton, // loading handler
  Button, Divider,
  Card, CardHeader, CardBody, Image, // card
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, // modal
} from "@nextui-org/react";

function ResultJson() {
  const { result, isLoading } = useContext(ResultContext);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // modal 

  const handleCardClick = (vulnerabilityData) => {
    setSelectedVulnerability(vulnerabilityData);
    onOpen()
  };


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

                      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start cursor-pointer"
                        // onPress={onOpen} 
                        onClick={() => handleCardClick({
                          vulnerability,
                          descriptions,
                          levelThereat,
                          typeThereat,
                          filePath,
                          solution,
                          attention
                        })}
                      >
                        <p className="text-tiny uppercase font-bold">{typeThereat}</p>
                        <small className="text-default-500">Level : {levelThereat}</small>
                        <h4 className="font-bold text-large">{vulnerability}</h4>
                      </CardHeader>

                      {/* <CardBody className="overflow-visible py-2 justify-end items-center" onClick={onOpen}>
                        <Image
                          alt="Card background"
                          className="object-cover rounded-xl self-end"
                          src="https://nextui.org/images/hero-card-complete.jpeg"
                          width={200}
                        />
                      </CardBody> */}

                      <Modal
                        size='2xl'
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
                                  <small className="text-default-100">Level uf Thereat : {selectedVulnerability.levelThereat}</small>
                                </div>
                              </ModalHeader>
                              <ModalBody>

                                <div className="text-sm">

                                  <div className="max-h-[350px] pr-3 overflow-y-auto">
                                    <div>
                                      <strong>File path:</strong>
                                      <ul>
                                        {selectedVulnerability.filePath.map((item, index) => (
                                          <li key={index}>- {item}</li>
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

                                <Button color="default" onPress={onClose}>View code changes</Button>

                              </ModalBody>
                              <ModalFooter>
                                {/* <Button color="secondary" variant="light" onPress={onClose}>
                                  Close
                                </Button> */}
                                <Button color="secondary"  variant="light" className="text-white" onPress={onClose}>
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
