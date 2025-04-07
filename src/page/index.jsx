import React, { useEffect, useRef, useState } from "react";
import "./index.css";

export default function Main() {
  const [image, setImage] = useState("");
  const [clothImage, setClothImage] = useState("");
  const [outputImage, setOuputImage] = useState("");
  const [outputImageBlob, setOutputImageBlob] = useState("");
  const [bodyType, setBodyType] = useState("upper_body");
  const imageRef = useRef();
  const clothRef = useRef();
  const [loader, setLoader] = useState(false);

  const tryOnClick = async (image, clothImage, bodyType) => {
    if (!image || !clothImage) return alert("Add image and garmet");
    const formdata = new FormData();
    let imageName = Date.now() + ".png";
    let imageBlob = await (await fetch(image))?.blob();
    let clothName = Date.now() + ".png";
    let clothImageBlob = await (await fetch(clothImage))?.blob();
    const imagefile = new File([imageBlob], imageName, {
      type: imageBlob.type,
    });
    const clothfile = new File([clothImageBlob], clothName, {
      type: clothImageBlob.type,
    });
    // console.log(imagefile);
    // console.log(clothfile);
    formdata.append("model_image", imagefile);
    formdata.append("garment_image", clothfile);
    // formdata.append("outfit_type", bodyType);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    setLoader(true);
    fetch("https://api.clothing.mirrar.com/try-on", requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        if (result?.output_image_url) {
          console.log(result)
          setOuputImage(result?.output_image_url[0]);
          try {
            let blob = await (await fetch(result?.output_image_url))?.blob();
            console.log(blob);
            setOutputImageBlob(blob);
          } catch (error) {

            console.log(error)
          }
        } else if (result?.status_code != 200) {
          alert("Something went wrong, Try again later");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoader(false);
      });
  };
  return (
    <>
      <input
        id="image"
        ref={imageRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files[0];
          setImage(URL.createObjectURL(file));
        }}
      />
      <input
        id="cloth"
        ref={clothRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files[0];
          setClothImage(URL.createObjectURL(file));
        }}
      />
      <div className="main-container w-[100vw] h-[100vh] bg-[#fff] relative overflow-hidden mx-auto my-0">
        <div className="w-[100%] h-[6%] bg-[#fff] border-solid border-t border-t-[#afafaf] relative mt-0 mr-0 mb-0 ml-0">
          <img
            className="h-full w-auto"
            src="/src/assets/images/9cbf8cc6-534a-4baf-9106-23e8b22a0a1a.png"
          />
        </div>
        <div className="m-[1%] flex w-[98%] h-[70%] justify-between items-center relative z-10">
          <div
            onClick={() => {
              imageRef?.current?.click();
            }}
            className="cursor-pointer w-[33%] h-full shrink-0 bg-[#f9f9f9] rounded-[9.458px] border-dashed border-[0.95px] border-[#afafaf] flex justify-center items-center flex-col"
          >
            {image ? (
              <img
                onClick={(event) => {
                  setImage("");
                  event?.stopPropagation();
                }}
                src="/src/assets/delete.svg"
                className="absolute top-0 left-[30%] w-8 mt-2"
              />
            ) : null}

            {image ? (
              <img
                src={image}
                alt="uploaded"
                className="cursor-pointer w-full max-h-[100%] object-contain"
              />
            ) : (
              <>
                <img src="/src/assets/Group 3.svg" alt="uploadIcon" />
                <span className="mt-4 flex w-[237px] h-[96px] justify-center items-start font-['Inter'] text-[20px] font-normal leading-[24.205px] text-[#000] relative text-center z-[12]">
                  Upload an Image (.png, jpg or jpeg)
                </span>
              </>
            )}
          </div>
          <div
            onClick={() => {
              clothRef?.current?.click();
            }}
            className=" w-[33%] h-full"
          >
            {/* <div
              onClick={(e) => {
                e?.stopPropagation();
              }}
              className="w-full h-[8%] p-1 mb-[1%] rounded-[10px] border-[#AFAFAF] border-[1px] flex justify-center"
            > */}
            {/* <select
                onChange={(e) => {
                  setBodyType(e.target.value);
                  setClothImage("");
                }}
                name="bodyType"
                id="bodyType"
                value={bodyType}
                className="cursor-pointer"
              >
                <option value="upper_body">Upper body</option>
                <option value="lower_body">Lower body</option>
              </select> */}
            {/* </div> */}
            <div className="cursor-pointer h-[91%] shrink-0 bg-[#f9f9f9] rounded-[9.458px] border-dashed border-[0.95px] border-[#afafaf] flex justify-center items-center flex-col">
              {clothImage ? (
                <img
                  onClick={(event) => {
                    event?.stopPropagation();
                    setClothImage("");
                  }}
                  src="/src/assets/delete.svg"
                  className="absolute top-[10%] left-[64%] w-8 mt-2"
                />
              ) : null}
              {clothImage ? (
                <img
                  src={clothImage}
                  alt="uploadedCloth"
                  className="w-full max-h-[100%] object-contain"
                />
              ) : (
                <>
                  <img src="/src/assets/Group 3.svg" alt="uploadClothIcon" />
                  <span className="mt-4 flex w-[278px] h-[96px] justify-center items-start font-['Inter'] text-[20px] font-normal leading-[24.205px] text-[#000] relative text-center z-[3]">
                    Upload a Cloth Image(.png, jpg or jpeg)
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="w-[33%] h-full flex  justify-center items-center shrink-0 bg-[#fff] rounded-[9.458px] border-solid border-[0.95px] border-[#afafaf] relative z-10">
            {!loader ? (
              outputImage ? (
                <img
                  src={outputImage}
                  alt="resut"
                  className="w-full max-h-[100%] object-contain"
                />
              ) : (
                <span className="flex  justify-center items-start font-['Inter'] text-[20px] font-normal leading-[24.205px] text-[#000]  top-[291.054px] left-[59.077px] text-center overflow-hidden z-[23]">
                  Click on Try Now to <br />
                  see the magic
                </span>
              )
            ) : (
              <div className="loader"></div>
            )}
          </div>
        </div>
        <div className="w-[99%] h-[20%] flex justify-start items-center">
          <div className="w-[33%] h-full flex items-center justify-evenly">
            <img
              onClick={(e) => {
                setImage(e?.target?.src);
              }}
              src="/src/assets/images/a528918fdc85c9049ae9099d8cde0697.png"
              className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
            />
            <img
              onClick={(e) => {
                setImage(e?.target?.src);
              }}
              src="/src/assets/images/8ef74f98800cd44d385ff0ee4ab78c9c8442a3eb.png"
              className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
            />
            <img
              onClick={(e) => {
                setImage(e?.target?.src);
              }}
              src="/src/assets/images/372c6039cbc519cf6fb8cc37b56bac4f5f849edb.png"
              className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
            />
          </div>
          <div className="w-[33%] h-full flex items-center justify-evenly">
            {bodyType == "upper_body" ? (
              <>
                <img
                  onClick={(e) => {
                    console.log(e?.target?.src);
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/87aa1e54d667dbf339aa9d68cfc514e562696281.png"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
                <img
                  onClick={(e) => {
                    console.log(e?.target?.src);
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/6f059e4e4c5370d1647aad5b5b3b892e095fed63.png"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
                <img
                  onClick={(e) => {
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/a50a0b378eef44d712bba7607787ea72d8cc573e.png"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
              </>
            ) : (
              <>
                <img
                  onClick={(e) => {
                    console.log(e?.target?.src);
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/08062305406-e1.jpg"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
                <img
                  onClick={(e) => {
                    console.log(e?.target?.src);
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/09794304400-e1.jpg"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
                <img
                  onClick={(e) => {
                    setClothImage(e?.target?.src);
                  }}
                  src="/src/assets/images/09794317400-e1.png"
                  className="cursor-pointer bg-cover bg-no-repeat rounded-[10px] h-full w-auto max-h-[100%]"
                />
              </>
            )}
          </div>
          <div className="w-[33%] h-full flex items-center justify-evenly flex-wrap flex-col">
            <span
              onClick={() => {
                setOuputImage("");
                setOutputImageBlob("");
                if (loader) {
                  return;
                } else {
                  tryOnClick(image, clothImage, bodyType);
                }
              }}
              className={
                "cursor-pointer mb-[2%] w-[100%] h-[40%] bg-black rounded-[10px] border border-[#afafaf] text-white p-[3%] flex justify-center leading-5" +
                ((clothImage && image) || loader
                  ? ""
                  : " disabled cursor-not-allowed")
              }
            >
              {outputImage ? "Try again" : "Try Now"}
            </span>
            <span
              className={
                "w-[100%] h-[40%] bg-[#f7f7f7] rounded-[10px] border border-[#afafaf] text-black   p-[3%] flex justify-center leading-5" +
                (outputImageBlob ? "" : " disabled: pointer-events-none")
              }
            >
              <a
                href={
                  outputImageBlob ? URL.createObjectURL(outputImageBlob) : ""
                }
                download="downloaded_image.png"
              >
                Download Image
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
