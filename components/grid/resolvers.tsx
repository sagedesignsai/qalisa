/**
 * Grid Component Resolvers
 * Maps component names to React components
 * Used by Reka.js for rendering
 */

import { Container } from './container';
import { Text } from './text';
import { Button } from './button';
import { Heading } from './heading';
import { ImageComponent } from './image';
import { Row } from './row';
import { Column } from './column';

export const Resolvers = {
  Container,
  Text,
  Button,
  Heading,
  Image: ImageComponent,
  Row,
  Column,
};

