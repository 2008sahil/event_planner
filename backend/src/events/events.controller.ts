import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("events")
export class EventsController {
  private events = [];

  // Endpoint to create an event with a file upload (FormData)
  @Post()
  @UseInterceptors(
    FileInterceptor("file")
  )

  create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File) {
    // Convert file to base64
    const fileBase64 = file ? this.convertFileToBase64(file) : null;

    // Create event with file data in memory
    const event = { id: Date.now(), ...createEventDto, file: fileBase64 };
    this.events.push(event);
    return event;
  }

  // Endpoint to get all events
  @Get()
  findAll() {
    return this.events;
  }


  // Endpoint to get a single event by ID
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.events.find((event) => event.id === id);
  }

  // Endpoint to update an event (with file upload)
  @Put(":id")
  @UseInterceptors(
    FileInterceptor("file")
  )

  update(@Param("id") id: number, @Body() updateEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File) {
    // console.log("update request",id,this.events)
    const eventIndex = this.events.findIndex((event) => event.id == id);
    if (eventIndex === -1) {
        console.log("not found",id,eventIndex)
      return { message: "Event not found" };
    }

    // Convert file to base64 if provided, else retain existing file
    const fileBase64 = file ? this.convertFileToBase64(file) : this.events[eventIndex].file;

    // Update the event with new data, including the file if uploaded
    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updateEventDto,
      file: fileBase64,
    };
    return this.events[eventIndex];
  }

  // Endpoint to delete an event by ID
  @Delete(":id")
  remove(@Param("id") id: number) {
    this.events = this.events.filter((event) => event.id != id);
    return { message: "Event deleted" };
  }

  // Helper function to convert file to base64 string
  private convertFileToBase64(file: Express.Multer.File): string {
    const fileBuffer = file.buffer; // Using the buffer directly
    const mimeType = file.mimetype; // Get the MIME type of the file
    return `data:${mimeType};base64,${fileBuffer.toString("base64")}`; // Include MIME type in Base64
  }
}

