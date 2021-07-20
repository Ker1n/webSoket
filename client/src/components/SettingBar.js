import React from 'react'
import toolState from '../store/toolState'

export const SettingBar = () => {
    return (
        <div className="setting-bar" style={{padding:'0 0 0 110px'}}>
        <label htmlFor='line-width'>Толщина линии</label>
            <input 
            type="number"
            style={{margin: 20}} 
            id='line-width' 
            defaultValue={1}  
            min={1} max={50} 
            onChange={e=> toolState.setLineWidth(e.target.value)}     
            />
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input type="color" id='stroke-color' onChange={e=> toolState.setStrokeColor(e.target.value)} />
        </div>
    )
}
