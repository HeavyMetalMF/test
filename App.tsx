import {
    useState,
    forwardRef,
    useImperativeHandle,
    InputHTMLAttributes, useRef,
} from 'react';


interface Param {
    id: number;
    name: string;
    type: 'string' | 'number';
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Color {
    id: number;
    name: string;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface Props {
    params: Param[];
    model: Model;
}

export interface ParamEditorRef {
    getModel: () => Model;
}

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

const App = ()=> {
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

const ParamEditor = forwardRef<ParamEditorRef, Props>(({ params, model }, ref) => {
    const [paramValues, setParamValues] = useState<ParamValue[]>(() => [
        ...model.paramValues,
    ]);

    useImperativeHandle(
        ref,
        () => ({
            getModel: () => ({
                paramValues,
                colors: model.colors,
            }),
        }),
        [paramValues, model.colors],
    );

    const handleParamChange = (paramId: number, newValue: string) => {
        setParamValues(prev =>
            prev.map(pv => (pv.paramId === paramId ? { ...pv, value: newValue } : pv)),
        );
    };

    const inputTypeMap: Record<Param['type'], InputHTMLAttributes<HTMLInputElement>['type']> = {
        string: 'text',
        number: 'number',
    };

    return (
        <div>
            {params.map(param => {
                const matched = paramValues.find(v => v.paramId === param.id);
                const value = matched ? matched.value : '';

                return (
                    <div key={param.id} style={{ marginBottom: 8 }}>
                        <label style={{ marginRight: 8 }}>{param.name}:</label>
                        <input
                            type={inputTypeMap[param.type] ?? 'text'}
                            value={value}
                            onChange={e => handleParamChange(param.id, e.target.value)}
                        />
                    </div>
                );
            })}
        </div>
    );
});