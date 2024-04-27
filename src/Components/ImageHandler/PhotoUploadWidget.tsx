import { Fragment } from "react/jsx-runtime"
import { Button, Grid, Header } from "semantic-ui-react"
import PhotoWidgetDropzone from "./PhotoWidgetDropzone"
import { useEffect, useState } from "react"
import PhotoWidgetCropper from "./PhotoWidgetCropper"

interface Props {
    loading: boolean
    uploadPhoto: (file: Blob) => void
}

const PhotoUploadWidget = ({ loading, uploadPhoto }: Props) => {
    const [files, setFiles] = useState<any>([])
    const [cropper, setCropper] = useState<Cropper>()

    const onCrop = () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Fragment>
            <Grid.Column width={4}>
                <Header sub color="teal" content="1.Insert Image" style={{ marginBottom: 10 }} />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>

            <Grid.Column width={1} />

            <Grid.Column width={4}>
                <Header sub color="teal" content="2.Crop Image" style={{ marginBottom: 10 }} />
                {files && files.length > 0 ? (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                ) : (
                    <div style={{ minHeight: 200 }} />
                )}
            </Grid.Column>

            <Grid.Column width={1} />

            <Grid.Column width={4}>
                <Header sub color="teal" content="3.Review & Upload" style={{ marginBottom: 10 }} />
                {files && files.length > 0 ? (
                    <>
                        <div className="img-preview" style={{ minHeight: 200, overflow: "hidden" }} />
                        <Button.Group widths={2}>
                            <Button onClick={onCrop} color="blue" icon='check' loading={loading} disabled={loading} />
                            <Button onClick={() => setFiles([])} color="red" icon='x' disabled={loading} />
                        </Button.Group>
                    </>
                ) : (
                    <div style={{ minHeight: 200 }} />
                )}
            </Grid.Column>
        </Fragment>
    )
}

export default PhotoUploadWidget