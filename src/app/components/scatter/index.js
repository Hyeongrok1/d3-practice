import React, { useState, useCallback, useMemo } from 'react';
import Test from '../test'
import './scatter.css'

export default function MyScatterplot() {
    const [useColor, setUseColor] = useState(true);
    const [xVar, setXVar] = useState('SepalLength');
    const [yVar, setYVar] = useState('SepalWidth');
    const [clickCount, setClickCount] = useState(0);

    const encodingOptions = useMemo(() => ['SepalLength', 'SepalWidth', 'PetalLength', 'PetalWidth'], []);
    
    const handleXChange = useCallback((event) => {
        setXVar(event.target.value);
    }, []);

    const handleYChange = useCallback((event) => {
        setYVar(event.target.value);
    }, []);

    const handleColorToggle = useCallback((event) => {
        setUseColor(event.target.checked);
        console.log(event.target.checked);
    }, []);

    const handleUpdate = useCallback(() => {
        setClickCount(prevCount => prevCount + 1);
    }, []);

    const handleReset = useCallback(() => {
            // setData(prevData => prevData.map(d => ({
            //     ...d,
            //     fill: 'black',
            // })));
            setXVar('SepalLength');
            setYVar('SepalWidth');
            setClickCount(prevCount => prevCount + 1);
            setUseColor(false); // 색상 인코딩도 해제
    }, []);


    return (
        <>
            <header>
                <nav id="round-nav" className="container navbar navbar-dark bg-dark">
                    <div className="container-fluid justify-content-center">
                        <span className="navbar-brand mb-0 h1">My Scatterplot</span>
                    </div>
                </nav>
            </header>

            <main className="container">
                <div className="row pt-2">
                    <div className="col-1 pe-2 text-end"><strong className="fs-6">X:</strong></div>
                    <div className="col-8" onChange={handleXChange}>
                        {encodingOptions.map(option => (
                            <div key={`x-${option}`} className="form-check form-check-inline fs-6">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="x-encoding"
                                    value={option}
                                    id={`x-${option}`}
                                    checked={xVar === option}
                                    readOnly // React에서는 checked prop과 함께 readOnly 또는 onChange 필수
                                />
                                <label className="form-check-label" htmlFor={`x-${option}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
                        
                {/* Y-Encoding Radios */}
                <div className="row">
                    <div className="col-1 text-end pe-2"><strong className = "fs-6">Y:</strong></div>
                    <div className="col-8" onChange={handleYChange}>
                        {encodingOptions.map(option => (
                            <div key={`y-${option}`} className="form-check form-check-inline fs-6">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="y-encoding"
                                    value={option}
                                    id={`y-${option}`}
                                    checked={yVar === option}
                                    readOnly
                                />
                                <label className="form-check-label" htmlFor={`y-${option}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-3 fs-6">
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="use-color"
                                checked={useColor}
                                onChange={handleColorToggle}
                            />
                            <label className="form-check-label" htmlFor="use-color">Color-encode Class</label>
                        </div>
                    </div>
                    <div id="buttons-wrapper" className="text-end">
                    <button id="reset" className="btn btn-secondary me-2" onClick={handleReset}>
                        Reset
                    </button>
                    </div>
                </div>



                <Test count={clickCount} chosenXVar={xVar} chosenYVar={yVar} colorUse={useColor}/>
            </main>
        </>
    );
}