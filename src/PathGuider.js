import React, { useState } from 'react';
import image from './image.png';

const PathGuider = () => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [allPaths, setAllPaths] = useState([]);
  const [pathVehicleInputs, setPathVehicleInputs] = useState({});
  const [bestPath, setBestPath] = useState(null);
  const [showPaths, setShowPaths] = useState(false);
  const [showResults, setShowResults] = useState(false);

  
  // Predefined paths with hardcoded routes and metrics
  const predefinedPaths = {
    // Slot 2 (Top rows A-C)
    'slot-2': [
      {
        id: 1,
        name: "Path 1",
        distance: 85,
        tJunctions: 2,
      },
      {
        id: 2,
        name: "Path 2",
        distance: 120,
        tJunctions: 4,
      },
      {
        id: 3,
        name: "Path 3",
        distance: 145,
        tJunctions: 6,
      },
      {
        id: 4,
        name: "Path 4",
        distance: 165,
        tJunctions: 8,
      }
    ],
    // Slot 3 (Middle rows D-F)
    'slot-3': [
      {
        id: 1,
        name: "Path 1",
        distance: 75,
        tJunctions: 1,
      },
      {
        id: 2,
        name: "Path 2",
        distance: 100,
        tJunctions: 3,
      },
      {
        id: 3,
        name: "Path 3",
        distance: 130,
        tJunctions: 5,
      }
    ],
    // Slot 4 (Bottom rows G-H)
    'slot-4': [
      {
        id: 1,
        name: "Path 1",
        distance: 65,
        tJunctions: 2,
      },
      {
        id: 2,
        name: "Path 2",
        distance: 90,
        tJunctions: 3,
      },
      {
        id: 3,
        name: "Path 3",
        distance: 115,
        tJunctions: 4,
      },
      {
        id: 4,
        name: "Path 4",
        distance: 140,
        tJunctions: 6,
      }
    ]
  };

  const generatePaths = (slotInput) => {
    if (!slotInput) return [];

    // Determine slot based on slot number
    const slotNumber = parseInt(slotInput);
    let slot = 'slot-3'; // default
    
    if (slotNumber === 2) slot = 'slot-2';
    else if (slotNumber === 3) slot = 'slot-3';
    else if (slotNumber === 4) slot = 'slot-4';

    const templatePaths = predefinedPaths[slot];
    
    // Create paths without vehicle initially
    const paths = templatePaths.map(template => ({
      ...template,
      vehicleIntensity: null,
      score: null
    }));

    return paths;
  };

  const calculateBestPath = () => {
    if (allPaths.length === 0) return;

    // Update all paths with their vehicle intensities and calculate scores
    const updatedPaths = allPaths.map(path => {
      const vehicleValue = parseInt(pathVehicleInputs[path.id]);
      // Allow 0 vehicle intensity, only exclude if input is empty or invalid
      const isValidInput = !isNaN(vehicleValue) && vehicleValue >= 0 && vehicleValue <= 100;
      return {
        ...path,
        vehicleIntensity: isValidInput ? vehicleValue : null,
        score: isValidInput ? calculatePathScore(path.distance, path.tJunctions, vehicleValue) : null
      };
    });

    // Find paths with valid vehicle inputs (including 0)
    const validPaths = updatedPaths.filter(path => path.vehicleIntensity !== null);
    
    if (validPaths.length > 0) {
      // Sort by score (lower is better for optimal path)
      const sortedPaths = validPaths.sort((a, b) => a.score - b.score);
      setBestPath(sortedPaths[0]);
      setShowResults(true);
    } else {
      setBestPath(null);
      setShowResults(false);
    }

    setAllPaths(updatedPaths);
  };

  const calculatePathScore = (distance, tJunctions, vehicleIntensity) => {
    // Lower scores are better (minimum distance + minimum T-junctions + minimum vehicle)
    // Weighted scoring system:
    // - Distance: 0.4x weight (shorter distance preferred)
    // - T-junctions: 1.2x weight (fewer intersections preferred - high weight due to safety/time)
    // - vehicle: 0.8x weight (less vehicle preferred)
    return (distance * 0.1) + (tJunctions * 0.6) + (vehicleIntensity * 0.3);
  };

  const handleShowPaths = () => {
    if (selectedSlot) {
      const paths = generatePaths(selectedSlot);
      setAllPaths(paths);
      setPathVehicleInputs({});
      setBestPath(null);
      setShowPaths(true);
      setShowResults(false);
    }
  };

  const handleVehicleChange = (pathId, value) => {
    setPathVehicleInputs(prev => ({
      ...prev,
      [pathId]: value
    }));
  };

  const handleReset = () => {
    setSelectedSlot('');
    setAllPaths([]);
    setPathVehicleInputs({});
    setBestPath(null);
    setShowPaths(false);
    setShowResults(false);
  };

  const getSlotColor = (slot) => {
    if (slot.isEntrance) return '#10b981';
    if (!slot.isSlot) return '#1f2937';
    if (slot.isOccupied) return '#ef4444';
    return '#60a5fa';
  };

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return '#10b981'; // Green for no vehicle
    if (intensity < 30) return '#4ade80';   // Light green for low vehicle
    if (intensity < 70) return '#facc15';   // Yellow for medium vehicle
    return '#f87171';                       // Red for high vehicle
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const mainContainerStyle = {
    maxWidth: '1280px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  };

  const subtitleStyle = {
    color: '#a5f3fc',
    fontSize: '1.125rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px'
  };

  const cardStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(34, 211, 238, 0.2)'
  };

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    color: '#a5f3fc',
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(34, 211, 238, 0.3)',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '12px',
    transition: 'transform 0.2s ease'
  };

  const resetButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(90deg, #64748b, #475569)',
  };

  const parkingGridContainerStyle = {
    background: '#111827',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  };

  const parkingGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gap: '4px',
    marginBottom: '16px'
  };

  const slotStyle = (slot) => ({
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: getSlotColor(slot),
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    color: 'white',
    fontWeight: 'bold'
  });

  const bestPathCardStyle = {
    background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    marginBottom: '24px'
  };

  const metricRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const pathItemStyle = (isBest) => ({
    padding: '16px',
    borderRadius: '12px',
    border: isBest ? '1px solid #22c55e' : '1px solid #4b5563',
    background: isBest ? 'rgba(34, 197, 94, 0.2)' : 'rgba(31, 41, 55, 0.5)',
    marginBottom: '12px',
    transition: 'all 0.3s ease'
  });

  const pathMetricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    fontSize: '0.875rem'
  };

  return (
    <div style={containerStyle}>
      <div style={mainContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <span style={{color: '#22d3ee'}}>🧭</span>
            Smart Parking Pathfinder
            <span style={{color: '#4ade80'}}>🚗</span>
          </h1>
          <p style={subtitleStyle}>Enter your parking slot and vehicle intensity </p>
        </div>

        <div style={gridStyle}>
          {/* Input Panel */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>
              <span style={{color: '#22d3ee'}}>⚙️</span>
              Configuration Panel
            </h2>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Selected Parking Slot</label>
              <input
                type="text"
                placeholder="e.g., 2, 3, 4"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(34, 211, 238, 0.3)'}
              />
              <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px'}}>
                Format: Slot number (2, 3, or 4)
              </div>
            </div>

            <div style={{marginTop: '24px'}}>
              <button 
                style={buttonStyle}
                onClick={handleShowPaths}
                disabled={!selectedSlot}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Show Available Paths
              </button>
              <button 
                style={resetButtonStyle}
                onClick={handleReset}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Reset
              </button>
            </div>

            <img src={image} alt="parking" className='p-4 h-auto w-auto' />
          </div>

          {/* Results Panel */}
          <div>
            {showResults && bestPath && (
              <div style={bestPathCardStyle}>
                <h3 style={{...cardTitleStyle, fontSize: '1.25rem'}}>
                  <span style={{color: '#4ade80'}}>⚡</span>
                  Optimal Path - {bestPath.name}
                </h3>
                <div>
                  <div style={metricRowStyle}>
                    <span style={{color: '#86efac'}}>Distance:</span>
                    <span style={{color: 'white', fontWeight: 'bold'}}>{bestPath.distance}m</span>
                  </div>
                  <div style={metricRowStyle}>
                    <span style={{color: '#86efac'}}>T-Junctions:</span>
                    <span style={{color: 'white', fontWeight: 'bold'}}>{bestPath.tJunctions}</span>
                  </div>
                  <div style={metricRowStyle}>
                    <span style={{color: '#86efac'}}>Vehicle Intensity:</span>
                    <span style={{color: getIntensityColor(bestPath.vehicleIntensity), fontWeight: 'bold'}}>
                      {bestPath.vehicleIntensity}%
                    </span>
                  </div>
                  <div style={{
                    ...metricRowStyle,
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    <span style={{color: '#86efac'}}>Optimization Score:</span>
                    <span style={{color: '#4ade80', fontWeight: 'bold'}}>{bestPath.score.toFixed(1)} (Lower is Better)</span>
                  </div>
                </div>
              </div>
            )}

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>
                <span style={{color: '#22d3ee'}}>🛣️</span>
                Available Paths & Vehicle Intensity 
              </h3>
              
              {!showPaths ? (
                <div style={{textAlign: 'center', padding: '40px 0'}}>
                  <div style={{fontSize: '4rem', marginBottom: '16px'}}>🚗</div>
                  <p style={{color: '#9ca3af', fontSize: '16px'}}>
                    Enter parking slot number to see available paths
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{marginBottom: '20px'}}>
                    <p style={{color: '#a5f3fc', fontSize: '14px', marginBottom: '16px'}}>
                      Enter vehicle intensity for each path to find the optimal route:
                    </p>
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {allPaths.map((path) => (
                        <div
                          key={path.id}
                          style={{
                            ...pathItemStyle(path.id === bestPath?.id),
                            marginBottom: '16px'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px'
                          }}>
                            <span style={{color: 'white', fontWeight: 'bold'}}>
                              {path.name}
                            </span>
                            {path.id === bestPath?.id && (
                              <span style={{
                                color: '#4ade80', 
                                fontSize: '0.875rem', 
                                fontWeight: 'bold',
                                background: 'rgba(34, 197, 94, 0.2)',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                OPTIMAL
                              </span>
                            )}
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '8px',
                            fontSize: '0.875rem',
                            marginBottom: '12px'
                          }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                              <span style={{color: '#22d3ee'}}>📏</span>
                              <span style={{color: '#d1d5db'}}>Distance: {path.distance}m</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                              <span style={{color: '#facc15'}}>⚠️</span>
                              <span style={{color: '#d1d5db'}}>T-Junctions: {path.tJunctions}</span>
                            </div>
                            {path.score && (
                              <div style={{textAlign: 'right'}}>
                                <span style={{fontSize: '0.75rem', color: '#9ca3af'}}>Score: </span>
                                <span style={{color: 'white', fontWeight: 'bold'}}>{path.score.toFixed(1)}</span>
                              </div>
                            )}
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <label style={{
                              color: '#a5f3fc',
                              fontSize: '14px',
                              fontWeight: '500',
                              minWidth: '120px'
                            }}>
                              Vehicle Intensity:
                            </label>
                            <input
                              type="number"
                              placeholder="0-100%"
                              min="0"
                              max="100"
                              value={pathVehicleInputs[path.id] || ''}
                              onChange={(e) => handleVehicleChange(path.id, e.target.value)}
                              style={{
                                ...inputStyle,
                                width: '100px',
                                padding: '8px 12px',
                                fontSize: '14px'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(34, 211, 238, 0.3)'}
                            />
                            <span style={{color: '#9ca3af', fontSize: '14px'}}>%</span>
                            {path.vehicleIntensity !== null && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginLeft: '12px'
                              }}>
                                <span style={{color: getIntensityColor(path.vehicleIntensity)}}>🚦</span>
                                <span style={{
                                  color: getIntensityColor(path.vehicleIntensity),
                                  fontWeight: 'bold',
                                  fontSize: '14px'
                                }}>
                                  {path.vehicleIntensity}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                      <button 
                        style={{
                          ...buttonStyle,
                          background: 'linear-gradient(90deg, #10b981, #059669)'
                        }}
                        onClick={calculateBestPath}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        Calculate Best Path
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

           

            {/* Instructions */}
            <div style={{
              ...cardStyle,
              marginTop: '24px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{...cardTitleStyle, fontSize: '1.125rem', marginBottom: '12px'}}>
                📋 How to Use
              </h3>
              <ul style={{color: '#bfdbfe', fontSize: '0.875rem', listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '8px'}}>1. Enter desired parking slot number (e.g., 2, 3, 4)</li>
                <li style={{marginBottom: '8px'}}>2. Click "Show Available Paths" to see route options</li>
                <li style={{marginBottom: '8px'}}>3. Enter vehicle intensity for each path (0-100%, where 0 = no vehicle)</li>
                <li style={{marginBottom: '8px'}}>4. Click "Calculate Best Path" to find optimal route</li>
                <li style={{color: '#86efac', fontSize: '0.8rem'}}>✨ Optimal path = Lowest combined score from distance, vehicle, and T-junctions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathGuider;