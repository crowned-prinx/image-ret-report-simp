// COMPLETE FIXED COMPONENT WITH PROPER IMAGE LOADER REGISTRATION

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

// Import Cornerstone and its dependencies
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import { LiquidGlassButton } from './ui/liquid-glass-button';
import { IconUpload } from '@tabler/icons-react';
import { toast } from 'sonner';

// Configure Cornerstone Tools
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;

// Configure WADO and Web Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

// Initialize the web worker
try {
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    webWorkerPath: 'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@4.9.1/dist/cornerstoneWADOImageLoaderWebWorker.min.js',
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        codecsPath: 'https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@4.9.1/dist/cornerstoneWADOImageLoaderCodecs.min.js',
      },
    },
  });
} catch (error) {
  console.error("Failed to initialize Cornerstone WADO Image Loader Web Worker:", error);
}

cornerstone.registerImageLoader('web', (imageId) => {
  // Remove the 'web:' prefix to get the actual blob URL
  const blobUrl = imageId.substring(4); // Remove 'web:' prefix
  return cornerstoneWebImageLoader.loadImage(blobUrl);
});

const DicomViewer = forwardRef(({ onImageLoaded, setshowReportInput }, ref) => {
  const cornerstoneElementRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    triggerUpload: () => {
      fileInputRef.current.click();
    },

    selectTool: (toolName) => {
      const element = cornerstoneElementRef.current;
      if (!element) return;

      if (toolName === 'Reset') {
        cornerstone.reset(element);
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
        return;
      }
      
      if (toolName === "TextMarker"){
        const TextMarkerTool = cornerstoneTools.TextMarkerTool;
        if (TextMarkerTool) {
           const configuration = {
              markers: ["F5", "F4", "F3", "F2", "F1"],
              current: "F5",
              ascending: true,
              loop: true,
            };
            cornerstoneTools.addTool(TextMarkerTool, { configuration });
            cornerstoneTools.setToolActive("TextMarker", { mouseButtonMask: 1 });
        } else {
          toast.error("TextMarker tool not found.");
        }
        return;
      }
     
      const Tool = cornerstoneTools[`${toolName}Tool`];
      if (Tool) {
        cornerstoneTools.addTool(Tool);
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
      } else {
        toast.error(`Tool ${toolName} not found in cornerstoneTools.`);
      }
    },
  }));

  // FIXED LoadImage function
  const loadImage = (file) => {
    if (!file || !cornerstoneElementRef.current) return;

    const element = cornerstoneElementRef.current;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const webImageExtensions = ['png', 'jpg', 'jpeg'];
    let imageId;

    if (webImageExtensions.includes(fileExtension)) {
      const fileUrl = URL.createObjectURL(file);
      imageId = 'web:' + fileUrl;
    } 
    else if (fileExtension === 'dcm') {
      imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    } 
    else {
      toast.error(`Unsupported file type: .${fileExtension}.`);
      setIsImageLoaded(false);
      return;
    }

    if (imageId) { 
      cornerstone.loadImage(imageId).then((image) => {
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);

        if (onImageLoaded) {
          onImageLoaded(file);
        }
        setIsImageLoaded(true);
        setshowReportInput(true)

        // Cleanup blob URLs properly
        if (imageId.startsWith('web:')) {
          const blobUrl = imageId.substring(4);
          URL.revokeObjectURL(blobUrl);
        }
      }).catch(err => {
        console.error('Error loading image:', err);
        toast.error(`Error loading image`);
        if (onImageLoaded) {
          onImageLoaded(null);
        }
        setIsImageLoaded(false);
      });
    }
  };

  // Setup Cornerstone and event listeners on mount
  useEffect(() => {
    const element = cornerstoneElementRef.current;
    if (!element) return;

    cornerstone.enable(element);
    cornerstoneTools.init({ showSVGCursors: true });

    // Drag and Drop handlers
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        loadImage(files[0]);
      }

    };
    
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
      cornerstone.disable(element);
    };
  }, []);

   const triggerUpload = () => {
      fileInputRef.current.click();
    };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      loadImage(files[0]);
    }
  };

  return (
    <div className="h-full w-full relative">
      <div
        ref={cornerstoneElementRef}
        className={`absolute h-full w-full border-2 transition-colors duration-300 ${isDragging ? 'border-teal-500 bg-neutral-700' : 'border-neutral-600'}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".dcm,.jpg,.png,.jpeg"
        />
        {!isImageLoaded && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-neutral-500 text-center p-4 pointer-events-none">
              Drop DICOM file here or use the upload button
            </p>
            <LiquidGlassButton
                      onClick={()=>triggerUpload()}
                      className="upload-image"
                      id="upload-image"
                      title="Upload an image"
                    >
                      <span className="icons flex items-center space-x-1">
                        <IconUpload/>
                        {isImageLoaded ? (
                          <span className="text-sm">Upload another Image</span>
                        ) : (
                          <span className="text-sm">Upload an image</span>
                        )}
                       </span>
                    </LiquidGlassButton>
          </div>
        )}
      </div>
    </div>
  );
});

export default DicomViewer;