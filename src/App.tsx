import { useRef } from 'react';
import ParamEditor, {Param, ParamEditorRef} from './ParamEditor';

const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
    { id: 3, name: 'Вес', type: 'number' },
];

const model = {
    paramValues: [
        { paramId: 1, value: 'повседневное' },
        { paramId: 2, value: 'макси' },
        { paramId: 3, value: '10' },
    ],
    colors: [],
};

export default function App() {
    const editorRef = useRef<ParamEditorRef>(null);

    const handleSave = () => {
        const updated = editorRef.current?.getModel();
        // делаем что нам нужно с новыми данными
        console.log(updated)
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div>
                <ParamEditor ref={editorRef} params={params} model={model} />
                <button onClick={handleSave}>Сохранить</button>
            </div>
        </div>
    );
}