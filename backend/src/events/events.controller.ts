import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("events")
export class EventsController {
  private events = [];

  @Post()
  @UseInterceptors(
    FileInterceptor("file")
  )



  create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File) {

    const fileBase64 = file ? this.convertFileToBase64(file) : null;

    const event = { id: Date.now(), ...createEventDto, file: fileBase64 };
    this.events.push(event);
    return event;
  }

  @Get()
  findAll() {
    return this.events;
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.events.find((event) => event.id === id);
  }

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

    const fileBase64 = file ? this.convertFileToBase64(file) : this.events[eventIndex].file;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updateEventDto,
      file: fileBase64,
    };
    return this.events[eventIndex];
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    this.events = this.events.filter((event) => event.id != id);
    return { message: "Event deleted" };
  }

  private convertFileToBase64(file: Express.Multer.File): string {
    const fileBuffer = file.buffer;
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  }
}

