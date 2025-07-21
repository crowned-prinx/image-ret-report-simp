import { useRef, useState } from "react";
import logo from "/assets/images/logo192.png"
import NavBar from "../NavBar/NavBar";
import { IconBook, IconHelp, IconPlus, IconSearch, IconUpload, IconUser } from "@tabler/icons-react";
import { LiquidGlassButton } from "../ui/liquid-glass-button";
import DicomViewer from "../dicom-viewer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner"
import { SuccessModal } from "../success-modal";
import ResultContent from "../result-content";

export default function Main({setOpen, setContent}) {

  const [isMaskVisible, setIsMaskVisible] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const cornerstoneViewerRef = useRef(null);
  const [activeTool, setActiveTool] = useState("Pan"); // Default to Pan
  const [findingsBorderOutline, setFindingsBorderOutline] = useState("");
  const [impressionBorderOutline, setImpressionBorderOutline] = useState(""); 
  const findingsOutlineRef = useRef(null);
  const impressionOutlineRef = useRef(null);
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReportInput, setshowReportInput] = useState(false)
  const [loadedFile, setLoadedFile] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  

  const handleUploadClick = () => {
    // Call the triggerUpload method exposed by the CornerstoneViewer component
    if (cornerstoneViewerRef.current) {
      cornerstoneViewerRef.current.triggerUpload();
    }
  };

  const handleToolSelect = (toolName) => {
    if (cornerstoneViewerRef.current) {
      // Call the method exposed by the viewer
      cornerstoneViewerRef.current.selectTool(toolName);
      // Update the active tool state
      setActiveTool(toolName);
    }
  };

  const handleSubmitData = async () => {

    if (!loadedFile) {
      return toast.error("Please upload an image first.");
    }
    
    const trimmedFindings = findings.trim();
    if (!trimmedFindings) {
      setFindingsBorderOutline("border border-red-400");
      findingsOutlineRef.current?.focus();
      return toast.error("Please provide valid findings.");
    }

    const trimmedImpression = impression.trim();
    if (!trimmedImpression) {
      setImpressionBorderOutline("border border-red-400");
      impressionOutlineRef.current?.focus();
      return toast.error("Please provide a valid impression.");
    }

    setImpressionBorderOutline("");
    setFindingsBorderOutline("");

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', loadedFile);
    formData.append('findings', trimmedFindings);
    formData.append('impression', trimmedImpression);
    
    try {
      const response = await fetch('http://0.0.0.0:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Handle HTTP errors like 404, 500, etc.
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Success:', result);
      toast.success('Successfully submitted and processed the report!');
      setFindings("");
      setImpression("");
      setSearchResult(result);
      setContent(<SuccessModal children={<ResultContent content={result} />} title={`Search Results (${result?.results?.length})`} description="We found some similar studies, you can review them below."/>);
      setOpen(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred while searching the database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
   return (
     <div className="flex flex-col h-screen p-0">
             {/* Header Start */}
       <header className="flex flex-nowrap justify-between items-center px-1 sm:px-5 relative shadow-3xl">

         <div className="hidden sm:flex items-center w-5 h-5">
           <a href="#">
             <img src={logo} alt="dicom-x" className="max-w-full h-auto" />
           </a>
         </div>
 
         {/* dicom-x cornerstone button start here */}
         <div className="header-nav relative p-1 flex flex-nowrap justify-around flex-grow">
          <NavBar onToolSelect={handleToolSelect} activeTool={activeTool} />
         </div>
         {/* dicom-x cornerstone button ends here */}
 
         <div className="relative p-1 flex space-x-1 justify-around text-white/50">

            <LiquidGlassButton
              variant="smart"
              className="help"
              onClick={() => setIsHelpModalOpen(true)}
              title="Help"
            >
             <span className="icons"><IconHelp/></span>
            </LiquidGlassButton>
            {searchResult && (
            <LiquidGlassButton
              variant="smart"
               className="user"
                title="User"
                onClick={()=>setOpen(true)}
             >
               <span className="icons flex items-center space-x-1"><IconBook/>  <span className="text-sm">Show result</span> </span>
             </LiquidGlassButton>
            )}
            
           </div>
       </header>
       {/* Header End */}

 
       {/* Body Content Start */}
       
       <main className="flex flex-col justify-between h-full bg-black">
         {/* Main Content Start */}
         <div className="flex h-full relative">
           {/* Sidebar Start */}

           <div className="w-2/12 bg-neutral-800 p-2 flex flex-col justify-between">
             <div className="side-nav-content px-2 py-4">
              
            {showReportInput && (
              <Card className="w-full @container/card text-white opacity-50 border-none p-0 m-0">
                <CardHeader className="p-0 m-0">
                  <CardTitle>Medical Report</CardTitle>
                  <CardDescription>
                    Please enter the accompanied medical report.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                 
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="med_findings">Findings</Label>
                        <Textarea
                          id="med_findings"
                          type="text"
                          rows={10}
                          className={`${findingsBorderOutline}`}
                          placeholder="Review of frontal and lateral views were remarkable..."
                          value={findings}
                          ref={findingsOutlineRef}
                          onChange={e => {
                            setFindings(e.target.value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2 relative">
                        <Label htmlFor="impression">
                          Impression
                        </Label>
                        <Textarea
                          id="impression"
                          type="text"
                          className={`${findingsBorderOutline}`}
                          placeholder="Bilateral lower lobe bronchiectasis with improved right lower..."
                          value={impression}
                          ref={impressionOutlineRef}
                          onChange={e => {
                            setImpression(e.target.value);
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  
                </CardContent>
              </Card>
              )}

               <div className="flex flex-col my-6 mb-10 space-y-2">

                    {showReportInput &&
                     <LiquidGlassButton
                      onClick={()=>handleSubmitData()}
                      className="submit-data"
                      title="Search"
                      disabled={findings.trim() === "" || impression.trim() === "" || isLoading}
                    >
                      <span className="icons flex items-center space-x-1">
                        <IconSearch/>
                        <span className="text-sm">Search Similar Study</span>
                       </span>
                    </LiquidGlassButton>
                     }
                 
               </div>
 
             </div>
              <div className="flex flex-col my-3 space-y-2">
              <LiquidGlassButton
                      onClick={()=>handleUploadClick()}
                      className="upload-image"
                      id="upload-image"
                      title="Upload an image"
                    >
                      <span className="icons flex items-center space-x-1">
                        <IconUpload/>
                        {showReportInput ? (
                          <span className="text-sm">Upload another Image</span>
                        ) : (
                          <span className="text-sm">Upload an image</span>
                        )}
                       </span>
                    </LiquidGlassButton>
                    </div>
           </div>
           {/* Sidebar End */}
 
           {/* Canvas Area Start */}
           <div className="w-10/12 p-1 flex flex-col items-stretch">
             <div className="rounded h-full bg-black relative overflow-hidden">

               {/* Loader Start */}
               {isLoading && 
               <div
                 className="absolute h-full w-full bg-black/90 flex items-center justify-center z-20"
               >
                 <div className="flex items-center justify-center space-x-2 text-white opacity-75">
                   <span><i className='bx bx-loader-circle bx-spin bx-md opacity-75'></i></span>
                   <span className="animate-pulse">Searching the database...</span>
                 </div>
               </div>}
               {/* Loader End */}
 
 
               {/* Cornerstone Canvas Element Start */}
               <div className="h-full relative p-1 flex flex-col items-stretch">
                 <div
                   className="rounded h-full bg-black relative overflow-hidden"
                   onContextMenu={(e) => e.preventDefault()}
                 >
                  <DicomViewer ref={cornerstoneViewerRef} setshowReportInput={setshowReportInput} onImageLoaded={setLoadedFile} />
                 </div>
               </div>
               {/* Cornerstone Canvas Element End */}

             </div>
           </div>
           {/* Canvas Area End */}
         </div>
         {/* Main Content End */}
       </main>
       
       {/* Example of Modal Conversion */}
       {isHelpModalOpen && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="rounded-lg shadow-2xl max-w-lg w-full bg-neutral-800">
               <Card className="w-full @container/card text-white opacity-50 border-none">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>
                    <div className="modal-body overflow-auto p-4" style={{ maxHeight: '50vh' }}>
                      
                          <p className="mb-4 text-sm text-gray-300">
                              This tool allows you to find similar clinical cases based on an image and its corresponding diagnostic report.
                          </p>

                          <ol className="list-decimal list-inside space-y-4 text-sm">
                              <li>
                                  <strong className="text-white">Upload Your Image</strong>
                                  <p className="pl-4 text-gray-400">
                                      Click the <span className="font-semibold text-cyan-400">Upload an Image</span> button located at the bottom-left of the screen. You can upload a medical image in one of the following formats:
                                  </p>
                                  <ul className="list-disc list-inside pl-8 text-gray-400 mt-2">
                                      <li>DICOM (.dcm)</li>
                                      <li>JPEG (.jpg, .jpeg)</li>
                                      <li>PNG (.png)</li>
                                  </ul>
                                  <p className="pl-4 text-gray-400 mt-1">
                                      Once loaded, your image will be displayed in the main viewer.
                                  </p>
                              </li>

                              <li>
                                  <strong className="text-white">Enter the Medical Report</strong>
                                  <p className="pl-4 text-gray-400">
                                      After uploading an image, the text input fields for the medical report will appear on the left. Please copy and paste the relevant sections of your report into the two boxes:
                                  </p>
                                  <ul className="list-disc list-inside pl-8 text-gray-400 mt-2">
                                      <li><strong>Findings:</strong> The detailed observations from the radiologist.</li>
                                      <li><strong>Impression:</strong> The final summary or conclusion of the report.</li>
                                  </ul>
                              </li>

                              <li>
                                  <strong className="text-white">Initiate the Search</strong>
                                  <p className="pl-4 text-gray-400">
                                      Once the image is loaded and both report fields are filled, click the <span className="font-semibold text-cyan-400">Search Similar Study</span> button. A loader will appear, indicating that the system is processing your query and searching the database.
                                  </p>
                              </li>
                              
                              <li>
                                  <strong className="text-white">Review the Results</strong>
                                  <p className="pl-4 text-gray-400">
                                      After the search is complete, a results modal will appear. You will see the top 5 most similar cases. For each case, you will find:
                                  </p>
                                  <ul className="list-disc list-inside pl-8 text-gray-400 mt-2">
                                      <li>The original, technical report and its image.</li>
                                      <li>A simplified, easy-to-understand version of the report.</li>
                                      <li>Detailed readability scores and a similarity metric to show how the text was improved.</li>
                                  </ul>
                              </li>
                          </ol>

                          <div className="mt-6 p-3 bg-neutral-900 rounded-lg">
                              <p className="text-xs text-cyan-400 font-semibold">PRO TIP:</p>
                              <p className="text-xs text-gray-400">You can use the tools in the toolbar at the top of the screen (Pan, Zoom, etc.) to interact with the images in the main viewer.</p>
                          </div>
                      </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                   <div className="modal-footer border-t border-gray-700 p-2 flex justify-end">
                    <LiquidGlassButton variant="smart" onClick={() => setIsHelpModalOpen(false)}>
                      Got it
                    </LiquidGlassButton>
                  </div>
                </CardContent>
              </Card>
           </div>
         </div>
       )}
     </div>
   );
}
